package com.fing.backend.converter;

import com.fing.backend.dto.MinShoppingCartDTO;
import com.fing.backend.dto.ShoppingCartDTO;
import com.fing.backend.entity.ShoppingCart;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class ShoppingCartConverter extends AbstractConverter<ShoppingCart, ShoppingCartDTO> {

    private static ShoppingCartConverter shoppingCartConverter;

    private ShoppingCartConverter() { }

    public static ShoppingCartConverter getInstance(){
        if (Objects.isNull(shoppingCartConverter)){
            shoppingCartConverter = new ShoppingCartConverter();
        }
        return shoppingCartConverter;
    }

    @Override
    public ShoppingCartDTO fromEntity(ShoppingCart e) {
        if (Objects.isNull(e)) {
            return null;
        }
        CustomerConverter customerConverter = CustomerConverter.getInstance();
        Map<Long, Integer> shoppingPosts = new HashMap<>();
        e.getShoppingPostQuantityMap().keySet().forEach(post -> shoppingPosts.put(post.getId(), e.getShoppingPostQuantityMap().get(post)));

        return ShoppingCartDTO.builder()
                .id(e.getId().toString())
                .subtotal(e.getSubtotal())
                .customerEmail(customerConverter.fromEntity(e.getCustomer()).getEmail())
                .shoppingPosts(shoppingPosts)
                .build();
    }

    @Override
    public ShoppingCart fromDTO(ShoppingCartDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        return ShoppingCart.builder()
            .id(Long.parseLong(d.getId()))
            .subtotal(d.getSubtotal())
            .build();
    }

    public MinShoppingCartDTO fromEntityToMin(ShoppingCart e){
        if (Objects.isNull(e)) return null;
        return MinShoppingCartDTO.builder()
                .id(String.valueOf(e.getId()))
                .subtotal(e.getSubtotal())
                .build();
    }

    public List<MinShoppingCartDTO> fromEntityToMin(List<ShoppingCart> shoppingCarts){
        if (Objects.isNull(shoppingCarts)) return null;
        return shoppingCarts.stream().map(this::fromEntityToMin).collect(Collectors.toList());
    }

    public ShoppingCart fromMinDTO(MinShoppingCartDTO d){
        if (Objects.isNull(d)) return null;
        return ShoppingCart.builder()
                .id(Long.valueOf(d.getId()))
                .subtotal(d.getSubtotal()).build();
    }

    public List<ShoppingCart> fromMinDTO(List<MinShoppingCartDTO> shoppingCarts){
        if (Objects.isNull(shoppingCarts)) return null;
        return shoppingCarts.stream().map(this::fromMinDTO).collect(Collectors.toList());
    }

}
