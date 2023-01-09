package com.fing.backend.converter;

import com.fing.backend.dto.AdministratorDTO;
import com.fing.backend.entity.Administrator;
import java.util.Objects;

public class AdministratorConverter extends AbstractConverter<Administrator, AdministratorDTO>{

    private static AdministratorConverter administratorConverter;

    private AdministratorConverter() { }

    public static AdministratorConverter getInstance() {
        if (Objects.isNull(administratorConverter)){
            administratorConverter = new AdministratorConverter();
        }
        return administratorConverter;
    }

    @Override
    public AdministratorDTO fromEntity(Administrator e) {
        if (Objects.isNull(e)) {
            return null;
        }
        return AdministratorDTO.builder()
                .id(e.getId().toString())
                .email(e.getEmail())
                .password((e.getPassword()))
                .role(e.getRole().toString()).build();
    }

    @Override
    public Administrator fromDTO(AdministratorDTO d) {
        if (Objects.isNull(d)){
            return null;
        }
        // Si es un administrador nuevo
        if (Objects.isNull(d.getId())) {
            return Administrator.builder()
                    .email(d.getEmail())
                    .password(d.getPassword())
                    .build();
        } else {
            return Administrator.builder()
                    .id(Long.parseLong(d.getId()))
                    .email(d.getEmail())
                    .password(d.getPassword())
                    .build();
        }
    }

}
