package com.fing.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Getter
@Setter
@ToString
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserReview {

    @Id @GeneratedValue (strategy= GenerationType.IDENTITY)
    private Long id;
    private Integer rating;
    private String description;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date date;

    @ManyToOne(cascade= CascadeType.MERGE)
    @JoinColumn(name = "fk_seller")
    private Seller seller;
    @ManyToOne(cascade=CascadeType.MERGE)
    @JoinColumn(name = "fk_customer")
    private Customer customer;

    @PrePersist
    private void onCreate(){
        date = new Date();
    }

}
