package com.fing.backend.business.interfaces;

import com.fing.backend.dto.NewShoppingPostDTO;
import com.fing.backend.dto.NewUserReviewDTO;
import com.fing.backend.dto.ShoppingPostDTO;
import com.fing.backend.dto.UserReviewDTO;
import com.fing.backend.exception.ShoppingPostException;
import com.fing.backend.exception.UserReviewException;

import java.util.List;

public interface IUserReviewService {
    void add(NewUserReviewDTO newUserReviewDTO) throws Exception;
    UserReviewDTO findById(Long id) throws UserReviewException;
    List<UserReviewDTO> list();
}
