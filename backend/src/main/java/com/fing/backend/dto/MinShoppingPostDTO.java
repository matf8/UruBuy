package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MinShoppingPostDTO {

    private String id;
    private String title;
    private Float price;
    private Boolean hasDelivery;
    private Float deliveryCost;
    private Boolean onSale;
    private Integer saleDiscount;
    private String sellerEmail;

}

