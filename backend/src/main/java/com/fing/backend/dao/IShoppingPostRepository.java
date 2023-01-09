package com.fing.backend.dao;

import com.fing.backend.entity.Category;
import com.fing.backend.entity.ShoppingPost;
import org.springframework.data.repository.CrudRepository;

public interface IShoppingPostRepository extends CrudRepository<ShoppingPost, Long> { }
