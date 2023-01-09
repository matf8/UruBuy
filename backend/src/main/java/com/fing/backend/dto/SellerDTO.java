package com.fing.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SellerDTO extends UserDTO {

    private String username;
    private String firstName;
    private String lastName;
    private Float averageRating;
    private Boolean isBlocked = false;
    private List<String> addresses;
    private String barcode;
    private String personalId;
    private String role;
    private List<PurchaseDTO> sales;
    private String picture;
    private List<UserReviewDTO> givenUserReviews;
    private List<UserReviewDTO> receivedUserReviews;

}
