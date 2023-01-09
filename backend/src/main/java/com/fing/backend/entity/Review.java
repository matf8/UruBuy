package com.fing.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private Integer rating;
    private String description;
    @ElementCollection(targetClass=String.class)
    private List<String> photosIdMongo = new ArrayList<>();
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "fk_shopping_post")
    private ShoppingPost shoppingPost;
    @ManyToOne
    @JoinColumn(name = "fk_customer")
    private Customer customer;

    @PrePersist
    private void onCreate(){
        date = new Date();
    }

}
