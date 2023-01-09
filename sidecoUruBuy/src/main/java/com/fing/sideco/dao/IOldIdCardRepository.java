package com.fing.sideco.dao;

import com.fing.sideco.entity.OldIdCard;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IOldIdCardRepository extends CrudRepository<OldIdCard, Long> {   }
