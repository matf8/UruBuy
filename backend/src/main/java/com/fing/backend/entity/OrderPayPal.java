package com.fing.backend.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class OrderPayPal {

    @Id
    private String id;
    private Float amount;
    private String description;
    private String invoiceIdMongo; // OrderInvoicePayPalId

    @Transient  // no persist in sql
    public static final String currency = "USD";
    @Transient
    public static final String method = "PAYPAL";
    @Transient
    public static final String intent = "SALE";
    @Transient
    public static final String successUrl = "http://urubuy.eu-west-1.elasticbeanstalk.com/paypal/success";  // "http://urubuy.eu-west-1.elasticbeanstalk.com/paypal/success"; // "http://localhost:5000/paypal/success"; // "https://backend.uru-buy.me/paypal/success"; // redirect a front
    @Transient
    public static final String cancelUrl = "http://urubuy.eu-west-1.elasticbeanstalk.com/paypal/cancel"; // "http://urubuy.eu-west-1.elasticbeanstalk.com/paypal/cancel"; // "http://localhost:5000/paypal/cancel";  // "https://backend.uru-buy.me/paypal/cancel";  // redirect a front fail page

    public OrderPayPal(String id, Float amount, String description, String invoiceId) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.invoiceIdMongo = invoiceId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OrderPayPal that = (OrderPayPal) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
