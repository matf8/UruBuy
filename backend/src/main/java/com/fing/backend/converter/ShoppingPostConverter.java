package com.fing.backend.converter;

import com.fing.backend.dto.MinShoppingPostDTO;
import com.fing.backend.dto.NewShoppingPostDTO;
import com.fing.backend.dto.ShoppingPostDTO;
import com.fing.backend.entity.ShoppingPost;
import com.fing.backend.enumerate.ShoppingPostStatus;
import com.fing.backend.exception.UserException;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class ShoppingPostConverter extends AbstractConverter<ShoppingPost, ShoppingPostDTO> {

    private static ShoppingPostConverter shoppingPostConverter;
    private CategoryConverter categoryConverter = CategoryConverter.getInstance();

    private ShoppingPostConverter() { }

    public static ShoppingPostConverter getInstance(){
        if (Objects.isNull(shoppingPostConverter)){
            shoppingPostConverter = new ShoppingPostConverter();
        }
        return shoppingPostConverter;
    }

    @Override
    public ShoppingPostDTO fromEntity(ShoppingPost e) {
        if (Objects.isNull(e)) {
            return null;
        }
        ReviewConverter reviewConverter = ReviewConverter.getInstance();
        return ShoppingPostDTO.builder()
                .id(e.getId().toString())
                .title(e.getTitle())
                .description(e.getDescription())
                .price(e.getPrice())
                .hasDelivery(e.getHasDelivery())
                .deliveryCost(e.getDeliveryCost())
                .addresses(e.getAddresses())
                .stock(e.getStock())
                .onSale(e.getOnSale())
                .saleDiscount(e.getSaleDiscount())
                .isNew(e.getIsNew())
                .weight(e.getWeight())
                .shoppingPostStatus(e.getShoppingPostStatus().toString())
                .averageRating(e.getAverageRating())
                .date(e.getDate())
                .category(categoryConverter.fromEntity(e.getCategory()))
                .sellerEmail(e.getSeller().getEmail())
                .reviews(reviewConverter.fromEntity(e.getReviews()))
                .build();
    }

    public MinShoppingPostDTO fromEntityToMin(ShoppingPost e){
        if (Objects.isNull(e)) return null;
        return MinShoppingPostDTO.builder()
                .id(String.valueOf(e.getId()))
                .title(e.getTitle())
                .price(e.getPrice())
                .hasDelivery(e.getHasDelivery())
                .deliveryCost(e.getDeliveryCost())
                .onSale(e.getOnSale())
                .saleDiscount(e.getSaleDiscount())
                .sellerEmail(e.getSeller().getEmail())
                .build();
    }

    public List<MinShoppingPostDTO> fromEntityToMin(List<ShoppingPost> shoppingPosts){
        if(Objects.isNull(shoppingPosts)) return null;
        return shoppingPosts.stream().map(this::fromEntityToMin).collect(Collectors.toList());
    }

    public ShoppingPost fromMinToEntity(MinShoppingPostDTO d){
        if(Objects.isNull(d)) return null;
        return ShoppingPost.builder()
                .id(Long.valueOf(d.getId()))
                .title(d.getTitle())
                .price(d.getPrice())
                .hasDelivery(d.getHasDelivery())
                .deliveryCost(d.getDeliveryCost())
                .onSale(d.getOnSale())
                .saleDiscount(d.getSaleDiscount())
                .build();
    }

    public List<ShoppingPost> fromMinToEntity(List<MinShoppingPostDTO> shoppingPostDTOS){
        if(Objects.isNull(shoppingPostDTOS)) return null;
        return shoppingPostDTOS.stream().map(this::fromMinToEntity).collect(Collectors.toList());
    }

    @Override
    public ShoppingPost fromDTO(ShoppingPostDTO d) throws UserException {
        if (Objects.isNull(d)) {
            return null;
        }

        return ShoppingPost.builder()
                .id(Long.parseLong(d.getId()))
                .title(d.getTitle())
                .description(d.getDescription())
                .price(d.getPrice())
                .hasDelivery(d.getHasDelivery())
                .deliveryCost(d.getDeliveryCost())
                .addresses(d.getAddresses())
                .stock(d.getStock())
                .onSale(d.getOnSale())
                .saleDiscount(d.getSaleDiscount())
                .isNew(d.getIsNew())
                .weight(d.getWeight())
                .shoppingPostStatus(ShoppingPostStatus.valueOf(d.getShoppingPostStatus()))
                .averageRating(d.getAverageRating())
                .date(d.getDate())
                .category(categoryConverter.fromDTO(d.getCategory()))
                .build();
    }

    public ShoppingPost fromNewDTO(NewShoppingPostDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        return ShoppingPost.builder()
                .title(d.getTitle())
                .description(d.getDescription())
                .price(d.getPrice())
                .hasDelivery(d.getHasDelivery())
                .deliveryCost(d.getDeliveryCost())
                .addresses(d.getAddresses())
                .stock(d.getStock())
                .onSale(d.getOnSale())
                .weight(d.getWeight())
                .saleDiscount(d.getSaleDiscount())
                .isNew(d.getIsNew())
                .averageRating(d.getAverageRating())
                .date(d.getDate())
                .build();
    }

}
