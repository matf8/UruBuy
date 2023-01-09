package com.fing.backend.dao;

import com.fing.backend.entity.UserReview;
import org.springframework.data.repository.CrudRepository;

public interface IUserReviewRepository extends CrudRepository<UserReview, Long> { }
