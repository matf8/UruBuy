package com.fing.backend.converter;

import com.fing.backend.dto.AdministratorDTO;
import com.fing.backend.dto.CustomerDTO;
import com.fing.backend.dto.SellerDTO;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;

import org.springframework.stereotype.Component;

@Component
public class JsonConverter {

    // las clases q deseamos mandar a front q tengan data
    // aunque he visto que el serializador json de rest client hace lo mismo asi q capaz esto es innecesario

    public JsonObject jsonCustomer(CustomerDTO customer) {
        JsonObject jsonComprador = Json.createObjectBuilder()
            .add("id", customer.getId())
            .add("email", customer.getEmail())
            .add("username", customer.getUsername())
            .add("addresses", (JsonArrayBuilder) customer.getAddresses())
            .add("isBlocked", customer.getIsBlocked())
            .add("averageRating", customer.getAverageRating()).build();
        return jsonComprador;
    }

    public JsonObject jsonSeller(SellerDTO Seller) {
        JsonObject jsonSeller = Json.createObjectBuilder()
            .add("id", Seller.getId())
            .add("email", Seller.getEmail())
            .add("username", Seller.getUsername())
            .add("addresses", (JsonArrayBuilder) Seller.getAddresses())
            .add("isBlocked", Seller.getIsBlocked())
            .add("barcode", Seller.getBarcode())
            .add("personalId", Seller.getPersonalId())
            .add("firstName", Seller.getFirstName())
            .add("lastName", Seller.getLastName())
            .add("averageRating", Seller.getAverageRating()).build();
        return jsonSeller;
    }

    public JsonObject jsonAdmin(AdministratorDTO admin) {
        JsonObject jsonAdmin = Json.createObjectBuilder()
            .add("id", admin.getId())
            .add("email", admin.getEmail()).build();
        return jsonAdmin;
    }

}