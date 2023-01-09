package com.fing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserLoginDTO {

    private String email;
    private String username;
    private String password;
    private String token;
    private String role;

}

