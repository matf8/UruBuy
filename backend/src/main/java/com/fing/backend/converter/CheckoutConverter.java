package com.fing.backend.converter;

import com.fing.backend.dto.CheckoutDTO;
import com.fing.backend.dto.MinCheckoutDTO;
import com.fing.backend.entity.Checkout;

import java.util.Objects;

public class CheckoutConverter extends AbstractConverter<Checkout, CheckoutDTO> {

    private static CheckoutConverter checkoutConverter;
    private final CheckoutShoppingPostConverter checkoutShoppingPostConverter = CheckoutShoppingPostConverter.getInstance();

    private CheckoutConverter() {
    }

    public static CheckoutConverter getInstance() {
        if (Objects.isNull(checkoutConverter)) {
            checkoutConverter = new CheckoutConverter();
        }
        return checkoutConverter;
    }

    @Override
    public CheckoutDTO fromEntity(Checkout e) {
        if (Objects.isNull(e)) {
            return null;
        }

        return CheckoutDTO.builder()
                .id(e.getId().toString())
                .subtotal(e.getSubtotal())
                .deliveryCost(e.getDeliveryCost())
                .discount(e.getDiscount())
                .total(e.getTotal())
                .customerEmail(e.getCustomer().getEmail())
                .checkoutShoppingPosts(checkoutShoppingPostConverter.fromEntity(e.getCheckoutShoppingPosts()))
                .build();
    }

    @Override
    public Checkout fromDTO(CheckoutDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        return Checkout.builder()
                .id(Long.parseLong(d.getId()))
                .subtotal(d.getSubtotal())
                .total(d.getTotal())
                .checkoutShoppingPosts(checkoutShoppingPostConverter.fromDTO(d.getCheckoutShoppingPosts()))
                .build();
    }

    public MinCheckoutDTO fromEntityToMin(Checkout e){
        if (Objects.isNull(e)) return null;
        return MinCheckoutDTO.builder()
                .id(String.valueOf(e.getId()))
                .total(e.getTotal())
                .build();
    }


    public Checkout fromMinDTO(MinCheckoutDTO d){
        if (Objects.isNull(d)) return null;
        return Checkout.builder()
                .id(Long.valueOf(d.getId()))
                .total(d.getTotal()).build();
    }

}
