package com.fing.backend.converter;

import com.fing.backend.dto.NewReviewDTO;
import com.fing.backend.dto.ReviewDTO;
import com.fing.backend.entity.Review;
import com.fing.backend.exception.UserException;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class ReviewConverter extends AbstractConverter<Review, ReviewDTO> {

    private static ReviewConverter reviewConverter;

    private ReviewConverter() { }

    public static ReviewConverter getInstance(){
        if (Objects.isNull(reviewConverter)){
            reviewConverter = new ReviewConverter();
        }
        return reviewConverter;
    }

    @Override
    public ReviewDTO fromEntity(Review e) {
        if (Objects.isNull(e)) {
            return null;
        }
        ShoppingPostConverter shoppingPostConverter = ShoppingPostConverter.getInstance();
        return ReviewDTO.builder()
                .id(e.getId().toString())
                .rating(e.getRating())
                .description(e.getDescription())
                .date(e.getDate())
                .customerEmail(e.getCustomer().getEmail())
                .shoppingPost(shoppingPostConverter.fromEntityToMin(e.getShoppingPost()))
                .build();
    }

    @Override
    public Review fromDTO(ReviewDTO d) throws UserException {
        if (Objects.isNull(d)) {
            return null;
        }

        return Review.builder()
                .id(Long.parseLong(d.getId()))
                .rating(d.getRating())
                .description(d.getDescription())
                .date(d.getDate())
                .build();
    }

    public Review fromNewDTO(NewReviewDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        return Review.builder()
                .rating(d.getRating())
                .description(d.getDescription())
                .date(d.getDate())
                .build();
    }

}
