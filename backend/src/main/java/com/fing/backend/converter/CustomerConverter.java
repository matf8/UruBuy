package com.fing.backend.converter;

import com.fing.backend.dto.CustomerDTO;
import com.fing.backend.entity.Customer;

import java.util.Objects;

public class CustomerConverter extends AbstractConverter<Customer, CustomerDTO> {

    private static CustomerConverter customerConverter;
    private CustomerConverter() { }

    public static CustomerConverter getInstance(){
        if (Objects.isNull(customerConverter)){
            customerConverter = new CustomerConverter();
        }
        return customerConverter;
    }

    @Override
    public CustomerDTO fromEntity(Customer e) {
        if (Objects.isNull(e)) {
            return null;
        }
        ShoppingCartConverter shoppingCartConverter = ShoppingCartConverter.getInstance();
        CheckoutConverter checkoutConverter = CheckoutConverter.getInstance();

        return CustomerDTO.builder()
                .id(e.getId().toString())
                .email(e.getEmail())
                .password(e.getPassword())
                .username(e.getUsername())
                .averageRating(e.getAverageRating())
                .isBlocked(e.getIsBlocked())
                .isSuspended(e.getIsSuspended())
                .addresses(e.getAddresses())
                .role(e.getRole().toString())
                .shoppingCart(shoppingCartConverter.fromEntityToMin(e.getShoppingCart()))
                .checkout(checkoutConverter.fromEntityToMin(e.getCheckout()))
                .picture(e.getPictureId())
                .notificationsEnabled(e.getNotificationsEnabled())
                .build();
    }

    @Override
    public Customer fromDTO(CustomerDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        // Si es un customer nuevo
        if (Objects.isNull(d.getId())) {
            return Customer.builder()
                    .email(d.getEmail())
                    .password(d.getPassword())
                    .username(d.getUsername())
                    .averageRating(d.getAverageRating())
                    .isBlocked(d.getIsBlocked())
                    .isSuspended(d.getIsSuspended())
                    .addresses(d.getAddresses())
                    .pictureId(d.getPicture())
                    .notificationsEnabled(d.getNotificationsEnabled())
                    .build();
        } else{
            ShoppingCartConverter shoppingCartConverter = ShoppingCartConverter.getInstance();
            CheckoutConverter checkoutConverter = CheckoutConverter.getInstance();

            return Customer.builder()
                    .id(Long.parseLong(d.getId()))
                    .email(d.getEmail())
                    .password(d.getPassword())
                    .username(d.getUsername())
                    .averageRating(d.getAverageRating())
                    .isBlocked(d.getIsBlocked())
                    .isSuspended(d.getIsSuspended())
                    .addresses(d.getAddresses())
                    .shoppingCart(shoppingCartConverter.fromMinDTO(d.getShoppingCart()))
                    .checkout(checkoutConverter.fromMinDTO(d.getCheckout()))
                    .pictureId(d.getPicture())
                    .notificationsEnabled(d.getNotificationsEnabled())
                    .build();
        }
    }

}
