package com.fing.backend.dao;

import com.fing.backend.entity.OrderPayPal;
import org.springframework.data.repository.CrudRepository;

public interface IOrderPayPalRepositoryJpa extends CrudRepository<OrderPayPal, String> { }
