package com.fing.backend.business.interfaces;

import com.fing.backend.dto.CheckoutDTO;
import com.fing.backend.dto.NewCheckoutDTO;
import com.fing.backend.exception.CheckoutException;

import java.util.List;

public interface ICheckoutService {
    Long addOrUpdate(NewCheckoutDTO newCheckoutDTO) throws Exception;
    void delete(Long id) throws CheckoutException;
    CheckoutDTO findById(Long id) throws CheckoutException;
    List<CheckoutDTO> list();
}
