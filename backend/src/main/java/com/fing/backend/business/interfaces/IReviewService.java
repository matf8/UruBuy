package com.fing.backend.business.interfaces;

import com.fing.backend.dto.NewReviewDTO;
import com.fing.backend.dto.ReviewDTO;
import com.fing.backend.exception.ReviewException;

import java.util.List;

public interface IReviewService {
    void add(NewReviewDTO newReviewDTO) throws Exception;
    ReviewDTO findById(Long id) throws ReviewException;
    List<ReviewDTO> list();
    Boolean alreadyReviewed(String customerEmail, Long shoppingPostId);
}
