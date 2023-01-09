package com.fing.backend.entity;

import com.fing.backend.enumerate.UserRole;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.Hibernate;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@ToString
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends User {

    @Column(unique = true)
    private String username;
    private Float averageRating = null;
    private Boolean isBlocked = false;
    private Boolean isSuspended = false;

    @ElementCollection(targetClass = String.class)
    private List<String> addresses;

    @Transient
    private final UserRole role = UserRole.CUSTOMER;

    @OneToMany
    private List<Review> givenReviews;
    @OneToMany
    private List<UserReview> givenUserReviews;
    @OneToMany
    private List<UserReview> receivedUserReviews;
    @OneToMany(mappedBy = "customer", cascade = CascadeType.MERGE)
    private List<Purchase> purchases;
    @OneToOne(mappedBy="customer")
    private ShoppingCart shoppingCart;
    @OneToOne(mappedBy="customer")
    private Checkout checkout;

    private String pictureId;
    private Boolean notificationsEnabled = true;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Customer customer = (Customer) o;
        return getId() != null && Objects.equals(getId(), customer.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
