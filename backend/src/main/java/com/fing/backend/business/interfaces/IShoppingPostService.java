package com.fing.backend.business.interfaces;

import com.fing.backend.dto.NewShoppingPostDTO;
import com.fing.backend.dto.ShoppingPostDTO;
import com.fing.backend.entity.ShoppingPost;
import com.fing.backend.exception.ReviewException;
import com.fing.backend.exception.ShoppingPostException;

import java.util.List;

public interface IShoppingPostService {
    void add(NewShoppingPostDTO newShoppingPostDTO) throws Exception;
    ShoppingPostDTO findById(Long id) throws ShoppingPostException, ReviewException;
    ShoppingPost findObjectById(Long id);
    List<ShoppingPostDTO> findAllById(List<Long> ids);
    List<ShoppingPostDTO> list();
    ShoppingPostDTO updateStatus(ShoppingPostDTO shoppingPostDTO) throws ShoppingPostException;
    ShoppingPostDTO update(ShoppingPostDTO shoppingPostDTO) throws ShoppingPostException;
    List<ShoppingPostDTO> listPaged(Integer page);
    void delete(Long id);
    void updateObject(ShoppingPost shoppingPost);
}
