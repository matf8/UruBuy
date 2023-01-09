package com.fing.backend.converter;

import com.fing.backend.dto.NewUserReviewDTO;
import com.fing.backend.dto.UserReviewDTO;
import com.fing.backend.entity.UserReview;
import com.fing.backend.exception.UserException;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class UserReviewConverter extends AbstractConverter<UserReview, UserReviewDTO> {

    private static UserReviewConverter userReviewConverter;

    private UserReviewConverter() { }

    public static UserReviewConverter getInstance(){
        if (Objects.isNull(userReviewConverter)){
            userReviewConverter = new UserReviewConverter();
        }
        return userReviewConverter;
    }

    @Override
    public UserReviewDTO fromEntity(UserReview e) {
        if (Objects.isNull(e)) {
            return null;
        }
        return UserReviewDTO.builder()
                .id(e.getId().toString())
                .rating(e.getRating())
                .description(e.getDescription())
                .date(e.getDate())
                .sellerEmail(e.getSeller().getEmail())
                .customerEmail(e.getCustomer().getEmail())
                .build();
    }

    @Override
    public UserReview fromDTO(UserReviewDTO d) throws UserException {
        if (Objects.isNull(d)) {
            return null;
        }

        return UserReview.builder()
                .id(Long.parseLong(d.getId()))
                .rating(d.getRating())
                .description(d.getDescription())
                .date(d.getDate())
                .build();
    }

    public UserReview fromNewDTO(NewUserReviewDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        return UserReview.builder()
                .rating(d.getRating())
                .description(d.getDescription())
                .date(d.getDate())
                .build();
    }

}
