package com.fing.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Checkout {

    @Id @GeneratedValue (strategy= GenerationType.IDENTITY)
    private Long id;
    @OneToMany(cascade = CascadeType.ALL)
    private List<CheckoutShoppingPost> checkoutShoppingPosts;
    private Float subtotal;
    private Float deliveryCost;
    private Float discount;
    private Float total;
    @OneToOne
    @JoinColumn(name="customer_id")
    private Customer customer;

}
