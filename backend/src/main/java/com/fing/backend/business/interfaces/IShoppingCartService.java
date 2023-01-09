package com.fing.backend.business.interfaces;

import com.fing.backend.dto.NewShoppingCartDTO;
import com.fing.backend.dto.ShoppingCartDTO;
import com.fing.backend.exception.ShoppingCartException;

import java.util.List;

public interface IShoppingCartService {
    void addShoppingPost(NewShoppingCartDTO newShoppingCartDTO) throws Exception;
    void removeShoppingPost(NewShoppingCartDTO newShoppingCartDTO) throws Exception;
    void delete(Long id) throws ShoppingCartException;
    ShoppingCartDTO findById(Long id) throws ShoppingCartException;
    ShoppingCartDTO findByCustomer(String email) throws Exception;
    List<ShoppingCartDTO> list();
}
