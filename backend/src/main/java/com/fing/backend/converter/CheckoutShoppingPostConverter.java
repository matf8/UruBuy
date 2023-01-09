package com.fing.backend.converter;

import com.fing.backend.dto.CheckoutShoppingPostDTO;
import com.fing.backend.dto.NewCheckoutShoppingPostDTO;
import com.fing.backend.entity.CheckoutShoppingPost;

import java.util.Objects;

public class CheckoutShoppingPostConverter extends AbstractConverter<CheckoutShoppingPost, CheckoutShoppingPostDTO> {

    private static CheckoutShoppingPostConverter checkoutShoppingPostConverter;
    private final ShoppingPostConverter shoppingPostConverter = ShoppingPostConverter.getInstance();


    private CheckoutShoppingPostConverter() { }

    public static CheckoutShoppingPostConverter getInstance(){
        if (Objects.isNull(checkoutShoppingPostConverter)){
            checkoutShoppingPostConverter = new CheckoutShoppingPostConverter();
        }
        return checkoutShoppingPostConverter;
    }

    @Override
    public CheckoutShoppingPostDTO fromEntity(CheckoutShoppingPost e) {
        if (Objects.isNull(e)) {
            return null;
        }

        return CheckoutShoppingPostDTO.builder()
                .id(e.getId())
                .quantity(e.getQuantity())
                .isDelivery(e.getIsDelivery())
                .address(e.getAddress())
                .shoppingPost(shoppingPostConverter.fromEntityToMin(e.getShoppingPost()))
                .build();
    }

    @Override
    public CheckoutShoppingPost fromDTO(CheckoutShoppingPostDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        return CheckoutShoppingPost.builder()
                .id(d.getId())
                .quantity(d.getQuantity())
                .isDelivery(d.getIsDelivery())
                .address(d.getAddress())
                .shoppingPost(shoppingPostConverter.fromMinToEntity(d.getShoppingPost()))
                .build();
    }

    public CheckoutShoppingPost fromNewDTO(NewCheckoutShoppingPostDTO d){
        if (Objects.isNull(d)) return null;
        return CheckoutShoppingPost.builder()
                .quantity(d.getQuantity())
                .isDelivery(d.getIsDelivery())
                .address(d.getAddress())
                .build();
    }

}
