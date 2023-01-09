package com.fing.backend.entity;

import com.paypal.api.payments.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document("OrderInvoicePayPal")
public class OrderInvoicePayPal {

    @Id
    private String id;
    private String orderId;
    private Payment invoice;

}
