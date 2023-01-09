package com.fing.backend.dao;

import com.fing.backend.entity.Purchase;
import org.springframework.data.repository.CrudRepository;

public interface IPurchaseRepository extends CrudRepository<Purchase, Long> { }
