package com.fing.backend.converter;

import com.fing.backend.exception.UserException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public abstract class AbstractConverter<E, D> {
    public abstract D fromEntity(E e);
    public abstract E fromDTO(D d) throws UserException;

    public List<D> fromEntity(List<E> entities){
        if(Objects.isNull(entities)) return null;
        return entities.stream()
                .map(e -> fromEntity(e))
                .collect(Collectors.toList());
    }

    public List<E> fromDTO(List<D> dtos){
        if(Objects.isNull(dtos)) return null;
        return dtos.stream()
                .map(d -> {
                    try {
                        return fromDTO(d);
                    } catch (UserException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }

}
