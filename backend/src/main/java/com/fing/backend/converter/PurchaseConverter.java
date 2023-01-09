package com.fing.backend.converter;

import com.fing.backend.dto.PurchaseDTO;
import com.fing.backend.entity.Purchase;
import com.fing.backend.enumerate.PurchaseStatus;

import java.util.Objects;

public class PurchaseConverter extends AbstractConverter<Purchase, PurchaseDTO> {

    private static PurchaseConverter purchaseConverter;
    private PurchaseConverter() { }

    public static PurchaseConverter getInstance() {
        if (Objects.isNull(purchaseConverter)){
            purchaseConverter = new PurchaseConverter();
        }
        return purchaseConverter;
    }

    @Override
    public PurchaseDTO fromEntity(Purchase e) {
        if (Objects.isNull(e)) {
            return null;
        }
        ShoppingPostConverter shoppingPostConverter = ShoppingPostConverter.getInstance();
        UserReviewConverter userReviewConverter = UserReviewConverter.getInstance();

        return PurchaseDTO.builder()
                .id(e.getId().toString())
                .status(e.getStatus().toString())
                .date(e.getDate())
                .total(e.getTotal())
                .address(e.getAddress())
                .isDelivery(e.getIsDelivery())
                .orderPayPalId(e.getOrderPayPal().getId())
                .sellerEmail(e.getSeller().getEmail())
                .customerEmail(e.getCustomer().getEmail())
                .shoppingPosts(shoppingPostConverter.fromEntityToMin(e.getShoppingPosts()))
                .customerReview(userReviewConverter.fromEntity(e.getCustomerReview()))
                .sellerReview(userReviewConverter.fromEntity(e.getSellerReview()))
                .build();
    }

    public Purchase fromDTO(PurchaseDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        if (Objects.isNull(d.getId())) {
            return Purchase.builder()
                    .status(PurchaseStatus.valueOf(d.getStatus()))
                    .date(d.getDate())
                    .total(d.getTotal())
                    .address(d.getAddress())
                    .isDelivery(d.getIsDelivery())
                    .build();
        } else {
            return Purchase.builder()
                    .id(Long.valueOf(d.getId()))
                    .status(PurchaseStatus.valueOf(d.getStatus()))
                    .date(d.getDate())
                    .total(d.getTotal())
                    .address(d.getAddress())
                    .isDelivery(d.getIsDelivery())
                    .build();
        }
    }

}
