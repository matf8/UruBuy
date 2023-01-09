package com.fing.backend.dao;

import com.fing.backend.entity.PayoutPayPal;
import org.springframework.data.repository.CrudRepository;

public interface IPayoutPayPalRepositoryJpa extends CrudRepository<PayoutPayPal, String> { }
