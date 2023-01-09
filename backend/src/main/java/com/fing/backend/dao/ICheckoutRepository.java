package com.fing.backend.dao;

import com.fing.backend.entity.Checkout;
import org.springframework.data.repository.CrudRepository;

public interface ICheckoutRepository extends CrudRepository<Checkout, Long> { }
