package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewShoppingCartDTO {

    private String customerEmail;
    private Long shoppingPostId;
    private Integer shoppingPostQuantity;

}

