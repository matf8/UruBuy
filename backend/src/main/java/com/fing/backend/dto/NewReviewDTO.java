package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewReviewDTO {

    private Integer rating;
    private String description;
    private Date date;
    private String customerEmail;
    private String shoppingPostId;
    private List<String> base64Images = new ArrayList<>();

}

