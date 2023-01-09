package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewCheckoutShoppingPostDTO {

    private Long shoppingPostId;
    private Integer quantity;
    private Boolean isDelivery;
    private String address;

}

