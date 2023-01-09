package com.fing.backend.rest;

import com.fing.backend.business.PayPalService;
import com.fing.backend.business.PurchaseService;
import com.fing.backend.business.interfaces.ICheckoutService;
import com.fing.backend.business.interfaces.IHelperService;
import com.fing.backend.business.interfaces.IOrderInvoicePayPalService;
import com.fing.backend.business.interfaces.IPurchaseService;
import com.fing.backend.business.interfaces.IShoppingCartService;
import com.fing.backend.business.interfaces.IShoppingPostService;
import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.dao.IPurchaseRepository;
import com.fing.backend.dao.IShoppingPostRepository;
import com.fing.backend.dao.UserRepository;
import com.fing.backend.dto.CheckoutDTO;
import com.fing.backend.dto.CheckoutShoppingPostDTO;
import com.fing.backend.dto.CustomerDTO;
import com.fing.backend.dto.MinShoppingPostDTO;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.OrderPayPal;

import com.fing.backend.entity.Purchase;
import com.fing.backend.entity.Seller;
import com.fing.backend.entity.ShoppingPost;
import com.fing.backend.enumerate.PurchaseStatus;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.PayerInfo;
import com.paypal.api.payments.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/paypal")
@CrossOrigin(value = "*")
@Slf4j
public class PayPalRest {

    @Autowired private PayPalService paypalService;
    @Autowired private IHelperService utilHelper;
    @Autowired private IOrderInvoicePayPalService invoiceService;
    @Autowired private IPurchaseService purchaseService;

    @GetMapping("/pay/{total}")
    public ResponseEntity<Void> payment(@PathVariable Float total) throws Exception {
        OrderPayPal order = new OrderPayPal();
        order.setAmount(total);
        String currency = (String) OrderPayPal.class.getField("currency").get(null); // why get(null)? https://stackoverflow.com/a/2685372
        String method = (String) OrderPayPal.class.getField("method").get(null);
        String intent = (String) OrderPayPal.class.getField("intent").get(null);
        String successUrl = (String) OrderPayPal.class.getField("successUrl").get(null);
        String cancelUrl = (String) OrderPayPal.class.getField("cancelUrl").get(null);
        try {
            Payment payment = paypalService.createPayment(String.valueOf(order.getAmount()), currency, method, intent, order.getDescription(), cancelUrl, successUrl);
            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    order.setId(payment.getId());
                    invoiceService.saveOrderUntilSuccess(order);
                    return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(link.getHref())).build();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping(value = "cancel")
    public ResponseEntity<Object> cancelPay() {
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://uru-buy.me/result")).build();
    }

    @GetMapping(value = "success")
    public ResponseEntity<Object> successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                utilHelper.pdfConverter(payment);
                PayerInfo payer = payment.getPayer().getPayerInfo();
                OrderPayPal orderPayPal = invoiceService.saveOrder(payment);
                purchaseService.add(payer.getEmail(), orderPayPal);
                utilHelper.sendInvoice(payer.getEmail(), payment.getId());
                return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://uru-buy.me/result")).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/transfer")
    public ResponseEntity<Object> transferSellers(@RequestBody Map<String, Float> recipients) throws Exception {
        if (Objects.nonNull(recipients))
            return new ResponseEntity<Object>(paypalService.transferToSellers(recipients), HttpStatus.OK);
        else return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
