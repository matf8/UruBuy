package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExchangeDTO {

    private String result;
    private String date;
    private String rate;
    private Boolean success;

}
