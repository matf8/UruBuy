package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
public class CustomerDTO extends UserDTO {

    private String username;
    private Float averageRating;
    private Boolean isBlocked = false;
    private Boolean isSuspended = false;
    private List<String> addresses;
    private String role;
    private MinShoppingCartDTO shoppingCart;
    private MinCheckoutDTO checkout;
    private List<PurchaseDTO> purchases;
    private String picture;
    private List<UserReviewDTO> givenUserReviews;
    private List<UserReviewDTO> receivedUserReviews;
    private List<ReviewDTO> givenReviews;
    private Boolean notificationsEnabled;
}
