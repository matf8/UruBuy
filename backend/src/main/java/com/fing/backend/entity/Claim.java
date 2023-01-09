package com.fing.backend.entity;

import com.fing.backend.enumerate.ClaimStatus;
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
import javax.persistence.OneToOne;
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
public class Claim {

    @Id @GeneratedValue (strategy= GenerationType.IDENTITY)
    private Long id;
    private String description;
    private ClaimStatus claimStatus;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date date;

    @OneToOne(cascade = CascadeType.ALL)
    private Purchase purchase;
    @OneToOne(cascade = CascadeType.ALL)
    private ShoppingPost shoppingPost;

    @PrePersist
    private void onCreate(){
        date = new Date();
    }

}
