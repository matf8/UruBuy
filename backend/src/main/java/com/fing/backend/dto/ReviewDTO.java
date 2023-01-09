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
public class ReviewDTO {

    private String id;
    private Integer rating;
    private String description;
    private Date date;
    private String customerEmail;
    private MinShoppingPostDTO shoppingPost;
    private List<String> base64Images;

}

