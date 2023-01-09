package com.fing.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PurchaseOrderDTO {

    private String idPurchase;
    private String idOrderPaypal;

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
