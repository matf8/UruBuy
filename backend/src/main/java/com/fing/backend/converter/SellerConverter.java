package com.fing.backend.converter;

import com.fing.backend.dto.SellerDTO;
import com.fing.backend.entity.Seller;

import java.util.Objects;

public class SellerConverter extends AbstractConverter<Seller, SellerDTO> {

    static SellerConverter sellerConverter;
    private SellerConverter() {  }

    public static SellerConverter getInstance(){
        if (Objects.isNull(sellerConverter)) {
            sellerConverter = new SellerConverter();
        }
        return sellerConverter;
    }

    @Override
    public SellerDTO fromEntity(Seller e){
        if (Objects.isNull(e)) {
            return null;
        }
        PurchaseConverter purchaseConverter = PurchaseConverter.getInstance();
        return SellerDTO.builder()
                .id(e.getId().toString())
                .email(e.getEmail())
                .password(e.getPassword())
                .username(e.getUsername())
                .firstName(e.getFirstName())
                .lastName(e.getLastname())
                .averageRating(e.getAverageRating())
                .isBlocked(e.getIsBlocked())
                .addresses(e.getAddresses())
                .personalId(e.getPersonalId())
                .barcode(e.getBarcode())
                .role(e.getRole().toString())
                .sales(purchaseConverter.fromEntity(e.getSales()))
                .picture(e.getPictureId())
                .build();
    }

    @Override
    public Seller fromDTO(SellerDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        // Si es un seller nuevo
        if (Objects.isNull(d.getId())) {
            return Seller.builder()
                    .email(d.getEmail())
                    .password(d.getPassword())
                    .username(d.getUsername())
                    .firstName(d.getFirstName())
                    .lastname(d.getLastName())
                    .averageRating(d.getAverageRating())
                    .isBlocked(d.getIsBlocked())
                    .addresses(d.getAddresses())
                    .personalId(d.getPersonalId())
                    .barcode(d.getBarcode())
                    .pictureId(d.getPicture())
                    .build();
        } else {
            return Seller.builder()
                    .id(Long.parseLong(d.getId()))
                    .email(d.getEmail())
                    .password(d.getPassword())
                    .username(d.getUsername())
                    .firstName(d.getFirstName())
                    .lastname(d.getLastName())
                    .averageRating(d.getAverageRating())
                    .isBlocked(d.getIsBlocked())
                    .addresses(d.getAddresses())
                    .personalId(d.getPersonalId())
                    .barcode(d.getBarcode())
                    .pictureId(d.getPicture())
                    .build();
            }
    }

}
