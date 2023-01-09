package com.fing.backend.dao.mongo;

import com.fing.backend.entity.PayoutInvoicePayPal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface IPayoutPayPalRepositoryNsql extends MongoRepository<PayoutInvoicePayPal, String> {

    @Query("{payoutId:'?0'}")
    PayoutInvoicePayPal findItemById(String payoutId);

   /* @Query(value="{currency:'?0'}", fields="{'id' : 1, 'description' : 1}")
    List<OrderPayPal> findAll(String currency);*/

    long count();

}