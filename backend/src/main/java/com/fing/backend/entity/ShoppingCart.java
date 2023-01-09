package com.fing.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.MapKeyClass;
import javax.persistence.MapKeyJoinColumn;
import javax.persistence.OneToOne;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingCart {

    @Id @GeneratedValue (strategy= GenerationType.IDENTITY)
    private Long id;
    private Float subtotal;

    @OneToOne
    @JoinColumn(name="customer_id")
    private Customer customer;
    @ManyToMany(cascade=CascadeType.MERGE)
    @JoinTable(name="shopping_post_shopping_cart", joinColumns=@JoinColumn(name="shopping_cart_id"), inverseJoinColumns=@JoinColumn(name="shopping_post_id"))
    private List<ShoppingPost> shoppingPosts = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name="shopping_cart_shopping_posts_map", joinColumns = @JoinColumn(name="shopping_cart_id"))
    @MapKeyClass(value = com.fing.backend.entity.ShoppingPost.class)
    @MapKeyJoinColumn(name = "shopping_post_id")
    @Column(name="quantity")
    private Map<ShoppingPost, Integer> shoppingPostQuantityMap = new HashMap<>();

    public void addShoppingPost(ShoppingPost shoppingPost, Integer quantity) {
        if (Objects.isNull(shoppingPostQuantityMap)) {
            shoppingPostQuantityMap = new HashMap<>();
        }
        shoppingPostQuantityMap.put(shoppingPost, quantity);
    }

    public void removeShoppingPost(ShoppingPost shoppingPost, Integer quantity) {
        shoppingPostQuantityMap.put(shoppingPost, quantity);
        if(shoppingPostQuantityMap.get(shoppingPost).equals(0)) shoppingPostQuantityMap.remove(shoppingPost);
    }

}
