package com.fing.backend.dao;

import com.fing.backend.entity.ShoppingCart;
import com.fing.backend.entity.ShoppingPost;
import org.springframework.data.repository.CrudRepository;

public interface IShoppingCartRepository extends CrudRepository<ShoppingCart, Long> { }
