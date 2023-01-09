package com.fing.backend.business.interfaces;

import com.fing.backend.dto.PurchaseDTO;
import com.fing.backend.entity.OrderPayPal;
import com.fing.backend.entity.Purchase;
import com.fing.backend.exception.PurchaseException;

import java.util.List;

public interface IPurchaseService {

    void add(String email, OrderPayPal orderPayPal) throws Exception;
    PurchaseDTO findById(String id) throws PurchaseException;
    Purchase findObjectById(String id);
    List<PurchaseDTO> list() throws Exception;
    PurchaseDTO updateStatus(PurchaseDTO purchaseDTO) throws PurchaseException;
    void update(Purchase purchase);

}
