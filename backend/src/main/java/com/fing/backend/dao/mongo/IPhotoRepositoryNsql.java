package com.fing.backend.dao.mongo;

import com.fing.backend.entity.Photo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface IPhotoRepositoryNsql extends MongoRepository<Photo, String> {

    @Query("{id:'?0'}")
    Photo findItemById(String photoId);

    @Query("{username:'?0'}")
    Photo findItemByUsername(String username);    

   /* @Query(value="{idReview:'?0'}")
    List<Photo> findAll(String idReview);*/

}





