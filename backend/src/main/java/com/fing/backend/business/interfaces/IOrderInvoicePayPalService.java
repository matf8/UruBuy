package com.fing.backend.business.interfaces;

import com.fing.backend.entity.OrderPayPal;
import com.paypal.api.payments.Payment;

public interface IOrderInvoicePayPalService {

    OrderPayPal saveOrder(Payment payment);
    void saveOrderUntilSuccess(OrderPayPal order);
    void deleteOrder(String idOrder);
}
