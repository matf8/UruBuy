package com.fing.backend.dao;

import com.fing.backend.entity.Category;
import org.springframework.data.repository.CrudRepository;

public interface ICategoryRepository extends CrudRepository<Category, Long> { }
