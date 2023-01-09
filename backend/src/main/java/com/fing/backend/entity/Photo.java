package com.fing.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Photo")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Photo {

    @Id
    private String id;
    private String base64;
    private Long idReview;
    private Long idShoppingPost;
    private String username;

}
