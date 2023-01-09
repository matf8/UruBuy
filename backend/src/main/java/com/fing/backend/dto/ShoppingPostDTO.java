package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingPostDTO {

    private String id;
    private String title;
    private String description;
    private Float price;
    private Boolean hasDelivery;
    private Float deliveryCost;
    private List<String> addresses;
    private Integer stock;
    private Boolean onSale;
    private Integer saleDiscount;
    private Boolean isNew;
    private Float weight;
    private String shoppingPostStatus;
    private Float averageRating;
    private Date date;
    private CategoryDTO category;
    private String sellerEmail;
    private List<String> base64Images;
    private List<ReviewDTO> reviews;

}

