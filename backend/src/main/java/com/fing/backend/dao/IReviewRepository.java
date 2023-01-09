package com.fing.backend.dao;

import com.fing.backend.entity.Review;
import org.springframework.data.repository.CrudRepository;

public interface IReviewRepository extends CrudRepository<Review, Long> { }
