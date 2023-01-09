package com.fing.backend.entity;

import com.fing.backend.enumerate.ShoppingPostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@ToString
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingPost {

    @Id @GeneratedValue (strategy= GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @ElementCollection(targetClass=String.class)
    private List<String> photosIdMongo = new ArrayList<>();
    private Float price;
    private Boolean hasDelivery;
    private Float deliveryCost;
    @ElementCollection(targetClass=String.class)
    private List<String> addresses = new ArrayList<>();
    private Integer stock;
    private Boolean onSale;
    private Integer saleDiscount;
    private Boolean isNew;
    private Float weight;
    private ShoppingPostStatus shoppingPostStatus;
    private Float averageRating;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "fk_category")
    private Category category;
    @ManyToOne
    @JoinColumn(name = "fk_seller")
    private Seller seller;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "purchase_id")
    private List<Purchase> purchases;

    @OneToMany(mappedBy = "shoppingPost", cascade = CascadeType.MERGE)
    private List<Review> reviews;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ShoppingPost shoppingPost = (ShoppingPost) o;
        return id != null && Objects.equals(id, shoppingPost.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @PrePersist
    private void onCreate(){
        date = new Date();
    }

}
