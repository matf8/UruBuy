package com.fing.backend.entity;

import com.fing.backend.enumerate.PurchaseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Purchase {

    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private PurchaseStatus status;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date date;
    private Float total;
    private String address;
    private Boolean isDelivery;
    @OneToOne
    @JoinColumn(name="order_pay_pal_id")
    private OrderPayPal orderPayPal;

    @ManyToMany
    @JoinColumn(name="shopping_post_id")
    private List<ShoppingPost> shoppingPosts;
    @ManyToOne(cascade = CascadeType.MERGE)
    private Seller seller;
    @ManyToOne(cascade = CascadeType.MERGE)
    private Customer customer;

    @OneToOne
    @JoinColumn(name="customer_review_id")
    private UserReview customerReview;
    @OneToOne
    @JoinColumn(name="seller_review_id")
    private UserReview sellerReview;


    public Purchase(PurchaseStatus status, Date d, Float total, String address, Boolean isDelivery, OrderPayPal orderPaypal) {
        this.status = status;
        this.date = d;
        this.total = total;
        this.address = address;
        this.isDelivery = isDelivery;
        this.orderPayPal = orderPaypal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Purchase purchase = (Purchase) o;
        return id != null && Objects.equals(id, purchase.id);
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
