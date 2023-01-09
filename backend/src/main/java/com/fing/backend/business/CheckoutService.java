package com.fing.backend.business;

import com.fing.backend.business.interfaces.ICheckoutService;
import com.fing.backend.business.interfaces.IShoppingPostService;
import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.converter.CheckoutConverter;
import com.fing.backend.converter.CheckoutShoppingPostConverter;
import com.fing.backend.converter.ShoppingPostConverter;
import com.fing.backend.dao.ICheckoutRepository;
import com.fing.backend.dao.ICheckoutShoppingPostRepository;
import com.fing.backend.dto.CheckoutDTO;
import com.fing.backend.dto.NewCheckoutDTO;
import com.fing.backend.dto.NewCheckoutShoppingPostDTO;
import com.fing.backend.entity.Checkout;
import com.fing.backend.entity.CheckoutShoppingPost;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.ShoppingPost;
import com.fing.backend.exception.CheckoutException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CheckoutService implements ICheckoutService {

    @Autowired private ICheckoutRepository checkoutRepository;
    @Autowired private ICheckoutShoppingPostRepository checkoutShoppingPostRepository;
    @Autowired private IShoppingPostService shoppingPostService;
    @Autowired private IUserService userService;
    private final CheckoutConverter checkoutConverter = CheckoutConverter.getInstance();
    private final CheckoutShoppingPostConverter checkoutShoppingPostConverter = CheckoutShoppingPostConverter.getInstance();
    private final ShoppingPostConverter shoppingPostConverter = ShoppingPostConverter.getInstance();

    @Transactional
    public Long addOrUpdate(NewCheckoutDTO checkoutDTO) throws Exception {
        Customer customer = userService.findCustomerObjectByEmailOrUsername(checkoutDTO.getCustomerEmail());
        if(Objects.isNull(customer)) throw new CheckoutException("El cliente ingresado no está registrado en el sistema");
        Checkout checkout = customer.getCheckout();
        Boolean isNew = false;
        if(Objects.isNull(checkout)){
            checkout = new Checkout();
            isNew = true;
        }
        List<NewCheckoutShoppingPostDTO> checkoutShoppingPostDTOs = checkoutDTO.getCheckoutShoppingPosts();
        List<CheckoutShoppingPost> checkoutShoppingPosts = new ArrayList<>();
        Float subtotal= Float.valueOf(0);
        Float discount= Float.valueOf(0);
        Float deliveryCost = Float.valueOf(0);
        for(NewCheckoutShoppingPostDTO newCheckoutShoppingPostDTO: checkoutShoppingPostDTOs){
            CheckoutShoppingPost checkoutShoppingPost = checkoutShoppingPostConverter.fromNewDTO(newCheckoutShoppingPostDTO);
            ShoppingPost shoppingPost = shoppingPostConverter.fromDTO(shoppingPostService.findById(newCheckoutShoppingPostDTO.getShoppingPostId()));
            subtotal += shoppingPost.getPrice() * checkoutShoppingPost.getQuantity();
            if(checkoutShoppingPost.getIsDelivery() && shoppingPost.getHasDelivery()) deliveryCost += shoppingPost.getDeliveryCost();
            if (shoppingPost.getOnSale()) discount += shoppingPost.getSaleDiscount() * shoppingPost.getPrice() * checkoutShoppingPost.getQuantity() / 100;
            checkoutShoppingPost.setShoppingPost(shoppingPost);
            checkoutShoppingPosts.add(checkoutShoppingPost);
        }
        Float total = subtotal + deliveryCost - discount;
        checkout.setCustomer(customer);
        customer.setCheckout(checkout);
        checkout.setSubtotal(subtotal);
        checkout.setDeliveryCost(deliveryCost);
        checkout.setDiscount(discount);
        checkout.setTotal(total);
        if(!isNew) checkoutShoppingPostRepository.deleteAll(checkout.getCheckoutShoppingPosts());
        checkout.setCheckoutShoppingPosts(checkoutShoppingPosts);
        checkoutRepository.save(checkout);
        return checkout.getId();
    }

    @Transactional
    public void delete(Long id) throws CheckoutException {
        Checkout checkout = checkoutRepository.findById(id).orElse(null);
        if(Objects.isNull(checkout)) throw new CheckoutException("No existe un checkout con el id ingresado");
        checkoutRepository.delete(checkout);
    }

    @Transactional
    public CheckoutDTO findById(Long id) throws CheckoutException {
        Checkout checkout = checkoutRepository.findById(id).orElse(null);
        if(Objects.isNull(checkout)) throw new CheckoutException("No existe un checkout con el id ingresado");
        return checkoutConverter.fromEntity(checkout);
    }

    @Transactional
    public List<CheckoutDTO> list() {
        return checkoutConverter.fromEntity((List<Checkout>) checkoutRepository.findAll());
    }

}
