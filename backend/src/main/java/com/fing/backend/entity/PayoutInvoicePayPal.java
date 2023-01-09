package com.fing.backend.entity;

import com.paypal.api.payments.Payment;
import com.paypal.api.payments.PayoutBatch;
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
@Document("PayoutInvoicePayPal")
public class PayoutInvoicePayPal {

    @Id
    private String id;
    private PayoutBatch invoice;
    private String invoiceRecipients;

}
