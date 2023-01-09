package com.fing.backend.business.interfaces;

import com.paypal.api.payments.*;
import urn.ebay.api.PayPalAPI.RefundTransactionResponseType;
import java.util.Map;

public interface IPayPalService {
        Payment createPayment(String total, String currency, String method, String intent, String description, String cancelUrl, String successUrl) throws Exception;
        Payment executePayment(String paymentId, String payerId) throws Exception;
        String transferToSellers(Map<String, Float> destinatarios) throws Exception;
        String claimUnclaimed(String idPayout);
        RefundTransactionResponseType refund(String idT, String precioReembolso, String descripcion, String razon) throws Exception;

}
