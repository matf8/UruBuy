package com.fing.backend.dto;

import com.fing.backend.entity.Customer;
import com.fing.backend.entity.Seller;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReviewDTO {

    private String id;
    private Integer rating;
    private String description;
    private Date date;
    private String sellerEmail;
    private String customerEmail;

}

