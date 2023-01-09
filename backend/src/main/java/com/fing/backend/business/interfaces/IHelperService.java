package com.fing.backend.business.interfaces;

import com.paypal.api.payments.Payment;

public interface IHelperService {
    void pdfConverter(Payment p);
    void sendInvoice(String c, String n);

}
