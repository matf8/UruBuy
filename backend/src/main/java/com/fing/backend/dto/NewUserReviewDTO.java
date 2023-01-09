package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewUserReviewDTO {

    private Integer rating;
    private String description;
    private Date date;
    private String sellerEmail;
    private String customerEmail;
    private String from;
    private String purchaseId;

}

