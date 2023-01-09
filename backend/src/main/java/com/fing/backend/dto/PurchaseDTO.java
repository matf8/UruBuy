package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class PurchaseDTO {

    private String id;
    private String status;
    private Date date;
    private Float total;
    private String address;
    private Boolean isDelivery;
    private String orderPayPalId;
    private String sellerEmail;
    private String customerEmail;
    private List<MinShoppingPostDTO> shoppingPosts;
    private UserReviewDTO customerReview;
    private UserReviewDTO sellerReview;

}
