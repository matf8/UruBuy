package com.fing.backend.converter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fing.backend.dto.ExchangeDTO;
import org.springframework.stereotype.Component;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Component
public class PriceConverter {

    public static Object getLocalExchange(Float amount) throws Exception {
        try {
            String auth = "T2jhZa5GVzHGX7aKjqAXujr9etbl1saf";
            String to = "UYU";
            String from = "USD";
            System.out.println(amount);
            Client client = ClientBuilder.newClient();
            WebTarget myResource = client.target("https://api.apilayer.com/exchangerates_data/convert?to=" + to + "&from=" + from + "&amount=" + amount);
            Response rs = myResource.request(MediaType.APPLICATION_JSON).header("apiKey", auth).get();
            if (rs.getStatus() == 200) {
                String o = rs.readEntity(String.class);
                ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                // convert to json
                JsonNode jsonNode = mapper.readValue(o, com.fasterxml.jackson.databind.JsonNode.class);
                ExchangeDTO ex = new ExchangeDTO();
                ex.setDate(jsonNode.get("date").asText());
                ex.setResult(jsonNode.get("result").asText());
                ex.setRate(jsonNode.get("info").get("rate").asText());
                ex.setSuccess(jsonNode.get("success").asBoolean());
                return ex;
            } else return rs.getStatus() + " Message: " + rs.readEntity(String.class);
        } catch (Exception e) {
            throw e;
        }

    }



}
