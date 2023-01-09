package com.fing.sideco.dao;

import com.fing.sideco.entity.NewIdCard;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface INewIdCardRepository extends CrudRepository<NewIdCard, Long> {   }
