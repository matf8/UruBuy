package com.fing.backend.dao;

import com.fing.backend.entity.ShoppingPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IShoppingPostPagination extends JpaRepository<ShoppingPost, String> {

}

