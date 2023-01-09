package com.fing.backend.dto;

import com.fing.backend.entity.OrderPayPal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;
import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OrderPayPalDTO {

    private String id;
    private Float amount;
    private String description;
    private String invoiceId;

    public OrderPayPal getEntity() {
        return new OrderPayPal(this.id, this.amount, this.description, this.invoiceId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OrderPayPalDTO that = (OrderPayPalDTO) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
