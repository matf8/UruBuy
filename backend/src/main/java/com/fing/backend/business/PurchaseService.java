package com.fing.backend.business;

import com.fing.backend.business.interfaces.ICheckoutService;
import com.fing.backend.business.interfaces.INotificationService;
import com.fing.backend.business.interfaces.IPurchaseService;
import com.fing.backend.business.interfaces.IShoppingCartService;
import com.fing.backend.business.interfaces.IShoppingPostService;
import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.converter.PurchaseConverter;
import com.fing.backend.dao.IOrderPayPalRepositoryJpa;
import com.fing.backend.dao.IPurchaseRepository;
import com.fing.backend.dto.CheckoutDTO;
import com.fing.backend.dto.CheckoutShoppingPostDTO;
import com.fing.backend.dto.CustomerDTO;
import com.fing.backend.dto.MinShoppingPostDTO;
import com.fing.backend.dto.PurchaseDTO;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.OrderPayPal;
import com.fing.backend.entity.Purchase;
import com.fing.backend.entity.Seller;
import com.fing.backend.entity.ShoppingPost;
import com.fing.backend.enumerate.PurchaseStatus;
import com.fing.backend.exception.PurchaseException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class PurchaseService implements IPurchaseService {

    @Autowired private IPurchaseRepository purchaseRepository;
    @Autowired private IOrderPayPalRepositoryJpa orderRepositoryJpa;
    @Autowired private IUserService userService;
    @Autowired private IShoppingCartService shoppingCartService;
    @Autowired private ICheckoutService checkoutService;
    @Autowired private IShoppingPostService shoppingPostService;
    @Autowired private INotificationService notificationService;
    private final PurchaseConverter purchaseConverter = PurchaseConverter.getInstance();

    public void add(String email, OrderPayPal orderPayPal) throws Exception {
        CustomerDTO customerDTO = userService.findCustomerByEmailOrUsername(email);
        shoppingCartService.delete(Long.valueOf(customerDTO.getShoppingCart().getId()));
        Long checkoutId = Long.valueOf(customerDTO.getCheckout().getId());
        CheckoutDTO checkoutDTO = checkoutService.findById(checkoutId);
        List<String> sellerEmails = new ArrayList<>();
        List<Purchase> purchasesToBeCreated = new ArrayList<>();
        for(CheckoutShoppingPostDTO checkoutShoppingPost: checkoutDTO.getCheckoutShoppingPosts()){
            Purchase purchase = new Purchase();
            Float subtotal= Float.valueOf(0);
            Float discount= Float.valueOf(0);
            Float deliveryCost= Float.valueOf(0);
            Float total = Float.valueOf(0);
            List<ShoppingPost> shoppingPosts = new ArrayList<>();
            MinShoppingPostDTO shoppingPostDTO = checkoutShoppingPost.getShoppingPost();
            String sellerEmail = shoppingPostDTO.getSellerEmail();
            if (!sellerEmails.contains(sellerEmail)){
                sellerEmails.add(sellerEmail);
                Customer customer = userService.findCustomerObjectByEmailOrUsername(checkoutDTO.getCustomerEmail());
                Seller seller = userService.findSellerObjectByEmailOrUsername(sellerEmail);
                customer.getPurchases().add(purchase);
                purchase.setCustomer(customer);
                seller.getSales().add(purchase);
                purchase.setSeller(seller);
                purchase.setIsDelivery(checkoutShoppingPost.getIsDelivery());
                purchase.setAddress(checkoutShoppingPost.getAddress());
                subtotal = shoppingPostDTO.getPrice() * checkoutShoppingPost.getQuantity();
                if(shoppingPostDTO.getHasDelivery()) deliveryCost = shoppingPostDTO.getDeliveryCost();
                if (shoppingPostDTO.getOnSale()) discount += shoppingPostDTO.getSaleDiscount() * shoppingPostDTO.getPrice() * checkoutShoppingPost.getQuantity() / 100;
                total = subtotal + deliveryCost - discount;
                purchase.setTotal(total);
                purchase.setStatus(PurchaseStatus.PREPARING_ORDER);
                ShoppingPost shoppingPost = shoppingPostService.findObjectById(Long.valueOf(shoppingPostDTO.getId()));
                shoppingPost.setStock(shoppingPost.getStock() - checkoutShoppingPost.getQuantity());
                shoppingPost.getPurchases().add(purchase);
                shoppingPosts.add(shoppingPost);
                purchase.setShoppingPosts(shoppingPosts);
                purchase.setOrderPayPal(orderPayPal);
                purchasesToBeCreated.add(purchase);
            }else {
                purchase = purchasesToBeCreated.stream().filter(p -> p.getSeller().getEmail().equals(sellerEmail)).findFirst().orElse(null);
                subtotal = shoppingPostDTO.getPrice() * checkoutShoppingPost.getQuantity();
                if (shoppingPostDTO.getOnSale())
                    discount += shoppingPostDTO.getSaleDiscount() * shoppingPostDTO.getPrice() * checkoutShoppingPost.getQuantity() / 100;
                total = subtotal + deliveryCost - discount;
                purchase.setTotal(purchase.getTotal() + total);
                ShoppingPost shoppingPost = shoppingPostService.findObjectById(Long.valueOf(shoppingPostDTO.getId()));
                shoppingPost.setStock(shoppingPost.getStock() - checkoutShoppingPost.getQuantity());
                purchase.getShoppingPosts().add(shoppingPost);
            }
        }
        purchaseRepository.saveAll(purchasesToBeCreated);
        checkoutService.delete(checkoutId);
    }

    public PurchaseDTO findById(String id) throws PurchaseException {
        if (Objects.nonNull(id))
            return purchaseConverter.fromEntity(purchaseRepository.findById(Long.valueOf(id)).orElse(null));
        else throw new PurchaseException("Compra/Venta id no encontrado");
    }

    @Transactional
    public Purchase findObjectById(String id){
        return purchaseRepository.findById(Long.valueOf(id)).orElse(null);
    }

    public List<PurchaseDTO> list() throws Exception {
        try {
            List<Purchase> purchases = new ArrayList<>();
            purchaseRepository.findAll().forEach(purchases::add);
            return purchaseConverter.fromEntity(purchases);
        } catch (Exception e) {
            e.printStackTrace();
            throw new PurchaseException("Problema con lista");
        }
    }

    @Transactional
    public PurchaseDTO updateStatus(PurchaseDTO purchaseDTO) throws PurchaseException {
        try {
            Purchase purchase = purchaseRepository.findById(Long.parseLong(purchaseDTO.getId())).orElse(null);
            if (Objects.isNull(purchase)) throw new PurchaseException("No existe una compra con el id ingresado");
            purchase.setStatus(PurchaseStatus.valueOf(purchaseDTO.getStatus()));
            purchaseRepository.save(purchase);
            try {
                notificationService.sendStatusChanged(purchase.getCustomer().getEmail(), purchaseConverter.fromEntity(purchase));
            } catch (Exception e) {
                log.info(e.getMessage());
            }
            return purchaseConverter.fromEntity(purchase);
        } catch (Exception e) {
            throw new PurchaseException(e.getMessage());
        }
    }

    @Transactional
    public void update(Purchase purchase) {
        purchaseRepository.save(purchase);
    }

}
