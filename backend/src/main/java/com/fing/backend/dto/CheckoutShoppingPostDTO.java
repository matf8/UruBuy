package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutShoppingPostDTO {

    private Long id;
    private MinShoppingPostDTO shoppingPost;
    private Integer quantity;
    private Boolean isDelivery;
    private String address;

}

