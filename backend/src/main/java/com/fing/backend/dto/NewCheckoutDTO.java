package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewCheckoutDTO {

    private List<NewCheckoutShoppingPostDTO> checkoutShoppingPosts;
    private Float subtotal;
    private Float deliveryCost;
    private Float discount;
    private Float total;
    private String customerEmail;

}

