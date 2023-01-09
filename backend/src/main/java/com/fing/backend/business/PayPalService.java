package com.fing.backend.business;

import com.fing.backend.business.interfaces.IPayPalService;
import com.fing.backend.config.PaypalConfig;
import com.fing.backend.dao.IPayoutPayPalRepositoryJpa;
import com.fing.backend.dao.mongo.IPayoutPayPalRepositoryNsql;
import com.fing.backend.entity.PayoutInvoicePayPal;
import com.fing.backend.entity.PayoutPayPal;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.paypal.api.payments.Amount;
import com.paypal.api.payments.Payer;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.PaymentExecution;
import com.paypal.api.payments.Payout;
import com.paypal.api.payments.PayoutBatch;
import com.paypal.api.payments.PayoutItem;
import com.paypal.api.payments.PayoutItemDetails;
import com.paypal.api.payments.PayoutSenderBatchHeader;
import com.paypal.api.payments.RedirectUrls;
import com.paypal.api.payments.Transaction;
import com.paypal.api.payments.Currency;
import com.paypal.api.payments.Error;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import urn.ebay.api.PayPalAPI.PayPalAPIInterfaceServiceService;
import urn.ebay.api.PayPalAPI.RefundTransactionReq;
import urn.ebay.api.PayPalAPI.RefundTransactionRequestType;
import urn.ebay.api.PayPalAPI.RefundTransactionResponseType;
import urn.ebay.apis.CoreComponentTypes.BasicAmountType;
import urn.ebay.apis.eBLBaseComponents.CurrencyCodeType;
import urn.ebay.apis.eBLBaseComponents.RefundType;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Service
@Slf4j
public class PayPalService implements IPayPalService {

    @Autowired private APIContext _ctxRest;
    @Autowired private PaypalConfig _ctxNvp;
    @Autowired private IPayoutPayPalRepositoryNsql payoutRepositoryNsql;
    @Autowired private IPayoutPayPalRepositoryJpa payoutPayPalRepositoryJpa;

    public Payment createPayment(String total, String currency, String method, String intent, String description, String cancelUrl, String successUrl) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(total);

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method.toString());

        Payment payment = new Payment();
        payment.setIntent(intent.toString());
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        return payment.create(_ctxRest);
    }

    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecute = new PaymentExecution();
        paymentExecute.setPayerId(payerId);
        return payment.execute(_ctxRest, paymentExecute);
    }

    public String transferToSellers(Map<String, Float> recipients) throws Exception {
        try {
            if (recipients.size() > 0) {
                PayoutSenderBatchHeader header = new PayoutSenderBatchHeader();
                header.setSenderBatchId("Payout_" + generateRandomId());
                List<PayoutItem> vendedores = new ArrayList<>();
                for (Map.Entry<String, Float> e: recipients.entrySet()) {
                    PayoutItem vendedor = new PayoutItem();
                    Currency amount = new Currency();
                    amount.setCurrency("USD");
                    amount.setValue(String.valueOf(e.getValue()));
                    vendedor.setAmount(amount);
                    vendedor.setRecipientType("EMAIL");
                    vendedor.setNote("Gracias por usar UruBuy!");
                    vendedor.setReceiver(e.getKey()); // mail de sandbox paypal
                    vendedores.add(vendedor);
                    vendedor.setSenderItemId("item_" + generateRandomId());
                }
                Payout p = new Payout();
                p.setSenderBatchHeader(header);
                p.setItems(vendedores);
                PayoutBatch res = p.create(_ctxRest, null);
                // List<PayoutItemDetails> = res.getItems(); devuelve null error paypalsdk? postman recupera bien la lista
                List<PayoutItemDetails> itemsRes = getListParticipants(res.getBatchHeader().getPayoutBatchId());
                // guarda en mongo
                PayoutInvoicePayPal invoice = new PayoutInvoicePayPal();
                invoice.setInvoice(res);
                invoice.setInvoiceRecipients(itemsRes.toString());
                payoutRepositoryNsql.save(invoice);
                // guardo en sql
                PayoutPayPal payoutUrubuy = new PayoutPayPal();
                payoutUrubuy.setId(res.getBatchHeader().getPayoutBatchId());
                payoutUrubuy.setInvoiceId(invoice.getId());
                payoutPayPalRepositoryJpa.save(payoutUrubuy);
                return itemsRes.toString();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    // por alguna razon, PayoutBatch.getItems() devuelve null, pero por postman funca bien, entonces simulo comportamiento postman
    public List<PayoutItemDetails> getListParticipants(String id) {
        List<PayoutItemDetails> ret = new ArrayList<>();
        String authorizationHeader = "Basic " + "QWJOU2Y1UUIyMDRPOUkzYk5udEtRTWdiaGRVLTZCR01sazB3aE1mS002eXByYWM3dk9JcFJQY250MzRvcDJ5Ni1xUmlXRktORWtna05ncGQ6RUdIeE93d2NYYzkwdnVXNXdMUUJGbEw4UlBSNTg3T29TM0paYWVyWnRZNndiZmxEcFZLZ05pUUhFb3IzSHNjRVZmc3lEUHJBY1VTTU14LW8=";
        Client client = ClientBuilder.newBuilder().build();
        WebTarget target = client.target("https://api-m.sandbox.paypal.com/v1/payments/payouts/" + id);
        try {
            Invocation inv = target.request(MediaType.APPLICATION_JSON_TYPE).header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                    .buildGet();
            Response res = inv.invoke();
            String k = res.readEntity(String.class);

            // convert to json
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonRes = mapper.readValue(k, JsonNode.class);

            // conver to list
            ArrayNode items = (ArrayNode) jsonRes.get("items");
            List<JsonNode> list = new ArrayList<>(items.size());
            for (Iterator<JsonNode> itr = items.elements(); itr.hasNext();)
                list.add(itr.next());

            // conver to list PayoutItem
            for (JsonNode p: list) {
                PayoutItem item = new PayoutItem();
                PayoutItemDetails itemDetails = new PayoutItemDetails();
                // itemDetail
                itemDetails.setPayoutBatchId(p.get("payout_batch_id").asText());
                itemDetails.setPayoutItemId(p.get("payout_item_id").asText());
                itemDetails.setTransactionStatus(p.get("transaction_status").asText());
                if (itemDetails.getTransactionStatus().equals("SUCCESS"))
                    itemDetails.setTransactionId(p.get("transaction_id").asText());
                else if (itemDetails.getTransactionStatus().equals("FAILED")) {
                    Error e = new Error();
                    e.setName(p.get("errors").get("name").asText());
                    e.setMessage(p.get("errors").get("message").asText());
                    itemDetails.setError(e);
                }
                Currency c = new Currency();
                c.setValue(p.get("payout_item_fee").get("value").asText());
                c.setCurrency(p.get("payout_item_fee").get("currency").asText());
                itemDetails.setPayoutItemFee(c);
                //item
                item.setRecipientType(p.get("payout_item").get("recipient_type").asText());
                Currency c2 = new Currency();
                c2.setValue(p.get("payout_item").get("amount").get("value").asText());
                c2.setCurrency(p.get("payout_item").get("amount").get("currency").asText());
                item.setAmount(c2);
                item.setNote(p.get("payout_item").get("note").asText());
                item.setReceiver(p.get("payout_item").get("receiver").asText());
                item.setSenderItemId(p.get("payout_item").get("sender_item_id").asText());
                itemDetails.setPayoutItem(item);
                ret.add(itemDetails);
            }
            client.close();
            log.info(ret.toString());
            return ret;
        } catch (Exception ex) {
            System.out.println("error request");
            ex.printStackTrace();
            log.error(ex.getMessage());
        }
        return null;
    }

    // ejecutar para recuperar el dinero de una transferencia que quedó con el estado UNCLAIMED(mail sin verificar) o esperar 180 dias a que vuelva sola o el vendedor verifique el correo de paypal real
    public String claimUnclaimed(String idPayout) {
        String authorizationHeader = "Basic " + "QWJOU2Y1UUIyMDRPOUkzYk5udEtRTWdiaGRVLTZCR01sazB3aE1mS002eXByYWM3dk9JcFJQY250MzRvcDJ5Ni1xUmlXRktORWtna05ncGQ6RUdIeE93d2NYYzkwdnVXNXdMUUJGbEw4UlBSNTg3T29TM0paYWVyWnRZNndiZmxEcFZLZ05pUUhFb3IzSHNjRVZmc3lEUHJBY1VTTU14LW8=";
        Client client = ClientBuilder.newBuilder().build();
        WebTarget target = client.target("https://api-m.sandbox.paypal.com/v1/payments/payouts-item/" + idPayout + "/cancel");
        try {
            Invocation inv = target.request(MediaType.APPLICATION_JSON_TYPE).header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                    .buildPost(Entity.json(this));
            Response res = inv.invoke();
            String k = res.readEntity(String.class);

            // convert to json
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonRes = mapper.readValue(k, JsonNode.class);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // creo que el vale es mejor porque para usar esta operacion el vendedor debe mandar a urubuy plata por la pagina
    // Refunds types: FULL *, PARTIAL *, EXTERNALDISPUTE, OTHER
    public RefundTransactionResponseType refund(String idT, String precioReembolso, String descripcion, String razon) throws Exception {
        try {
            // Inicializar SDK
            Map<String, String> configurationMap = _ctxNvp.getAcctAndConfig();
            PayPalAPIInterfaceServiceService nvp = new PayPalAPIInterfaceServiceService(configurationMap);
            // Clases  PayPal de reembolso
            RefundType tipoReembolso;
            RefundTransactionReq req = new RefundTransactionReq();
            RefundTransactionRequestType reqType = new RefundTransactionRequestType();

            if (idT != null) {
                reqType.setTransactionID(idT);
                // chequeo que tipo de reembolso será
                if (descripcion.equals("parcial"))
                    tipoReembolso = RefundType.PARTIAL;
                else if (descripcion.equals("total"))
                    tipoReembolso = RefundType.FULL;
                else tipoReembolso = RefundType.OTHER; // ?
                reqType.setRefundType(tipoReembolso);
                reqType.setMemo(razon); // nota
                // si el rembolso es parcial se debe indicar cual es el monto a rembolsar
                if (tipoReembolso == RefundType.PARTIAL) {
                    BasicAmountType amount = new BasicAmountType();
                    amount.setValue(precioReembolso);
                    CurrencyCodeType currency = CurrencyCodeType.USD;
                    amount.setCurrencyID(currency);
                    reqType.setAmount(amount);
                }
                // ejecucion del refund
                req.setRefundTransactionRequest(reqType);
                RefundTransactionResponseType res = nvp.refundTransaction(req);
                // guardar res en coleccion reembolsos

                //System.out.println(res.getRefundTransactionID());
                return res;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    private String getTimestamp() {
        Timestamp t = new Timestamp(System.currentTimeMillis());
        return String.valueOf(t.getTime());
    }

    public String generateRandomId() {
        Random random = new Random();
        Long timestamp = Long.valueOf(getTimestamp());
        return String.valueOf(Math.abs((random.ints(timestamp).findFirst().getAsInt())));
    }
}