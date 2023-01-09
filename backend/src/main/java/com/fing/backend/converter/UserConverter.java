package com.fing.backend.converter;

import java.util.Objects;
import com.fing.backend.dto.UserDTO;
import com.fing.backend.entity.User;


public class UserConverter extends AbstractConverter<User, UserDTO> {

    private static UserConverter userConverter;

    private UserConverter() { }

    public static UserConverter getInstance() {
        if (Objects.isNull(userConverter)){
            userConverter = new UserConverter();
        }
        return userConverter;
    }

    @Override
    public UserDTO fromEntity(User e) {
        if (Objects.isNull(e)) {
            return null;
        }
        return UserDTO.builder()
                .id(e.getId().toString())
                .email(e.getEmail())
                .password((e.getPassword())).build();
    }

    @Override
    public User fromDTO(UserDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        return User.builder()
                .id(Long.parseLong(d.getId()))
                .email(d.getEmail())
                .password(d.getPassword())
                .build();
    }

}
