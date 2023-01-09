package com.fing.backend.entity;

import com.fing.backend.enumerate.UserRole;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@ToString
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Seller extends User {

    @Column(unique = true)
    private String username;
    private String firstName, lastname;
    private Float averageRating = null;
    private Boolean isBlocked = false;

    @ElementCollection(targetClass=String.class)
    private List<String> addresses;

    @Column(unique = true)
    private String personalId;
    @Column(unique = true)
    private String barcode;

    private String pictureId;

    @Transient
    private final UserRole role = UserRole.SELLER;

    @OneToMany
    private List<UserReview> givenUserReviews;
    @OneToMany
    private List<UserReview> receivedUserReviews;
    @OneToMany(mappedBy = "seller", cascade = CascadeType.MERGE)
    private List<Purchase> sales;
    @OneToMany
    private List<ShoppingPost> shoppingPosts;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Seller seller = (Seller) o;
        return getId() != null && Objects.equals(getId(), seller.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}