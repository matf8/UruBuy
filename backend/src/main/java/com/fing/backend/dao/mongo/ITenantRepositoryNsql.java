package com.fing.backend.dao.mongo;

import com.fing.backend.entity.Photo;
import com.fing.backend.entity.TenantInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ITenantRepositoryNsql extends MongoRepository<TenantInfo, String> { }