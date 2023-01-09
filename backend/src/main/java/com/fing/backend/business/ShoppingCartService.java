package com.fing.backend.business;

import com.fing.backend.business.interfaces.IShoppingCartService;
import com.fing.backend.business.interfaces.IShoppingPostService;
import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.converter.CustomerConverter;
import com.fing.backend.converter.SellerConverter;
import com.fing.backend.converter.ShoppingCartConverter;
import com.fing.backend.converter.ShoppingPostConverter;
import com.fing.backend.dao.IShoppingCartRepository;
import com.fing.backend.dto.CustomerDTO;
import com.fing.backend.dto.MinShoppingCartDTO;
import com.fing.backend.dto.NewShoppingCartDTO;
import com.fing.backend.dto.ShoppingCartDTO;
import com.fing.backend.dto.ShoppingPostDTO;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.Seller;
import com.fing.backend.entity.ShoppingCart;
import com.fing.backend.entity.ShoppingPost;
import com.fing.backend.exception.ShoppingCartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;

@Service
public class ShoppingCartService implements IShoppingCartService {

    @Autowired private IShoppingCartRepository shoppingCartRepository;
    @Autowired private IShoppingPostService shoppingPostService;
    @Autowired private IUserService userService;
    private final ShoppingCartConverter shoppingCartConverter = ShoppingCartConverter.getInstance();
    private final ShoppingPostConverter shoppingPostConverter = ShoppingPostConverter.getInstance();
    private final CustomerConverter customerConverter = CustomerConverter.getInstance();
    private final SellerConverter sellerConverter = SellerConverter.getInstance();

    public void addShoppingPost(NewShoppingCartDTO newShoppingCartDTO) throws Exception {
        Customer customer = customerConverter.fromDTO((CustomerDTO) userService.findCustomerByEmailOrUsername(newShoppingCartDTO.getCustomerEmail()));
        if(Objects.isNull(customer)) throw new ShoppingCartException("El cliente ingresado no está registrado en el sistema");
        MinShoppingCartDTO customerShoppingCart = ((CustomerDTO) userService.findCustomerByEmailOrUsername(newShoppingCartDTO.getCustomerEmail())).getShoppingCart();
        ShoppingPostDTO shoppingPostDTO = shoppingPostService.findById(newShoppingCartDTO.getShoppingPostId());
        ShoppingPost shoppingPost = shoppingPostConverter.fromDTO(shoppingPostDTO);
        Integer quantity = newShoppingCartDTO.getShoppingPostQuantity();
        ShoppingCart shoppingCart = new ShoppingCart();
        if(Objects.isNull(customerShoppingCart)) {
            shoppingCart.addShoppingPost(shoppingPost, quantity);
            shoppingCart.setSubtotal(shoppingPost.getPrice()*quantity);
            shoppingCart.setCustomer(customer);
        }else{
            shoppingCart = shoppingCartRepository.findById(Long.valueOf(customerShoppingCart.getId())).orElse(null);
            if (shoppingCart.getShoppingPostQuantityMap().containsKey(shoppingPost)){
                Integer oldQuantity = shoppingCart.getShoppingPostQuantityMap().get(shoppingPost);
                shoppingCart.addShoppingPost(shoppingPost, oldQuantity + quantity);
            }else shoppingCart.addShoppingPost(shoppingPost, quantity);
            shoppingCart.setSubtotal(shoppingCart.getSubtotal() + (shoppingPost.getPrice() * quantity));
        }
        Seller seller = sellerConverter.fromDTO(userService.findSellerByEmailOrUsername(shoppingPostDTO.getSellerEmail()));
        shoppingPost.setSeller(seller);
        shoppingCartRepository.save(shoppingCart);
    }

    public void removeShoppingPost(NewShoppingCartDTO newShoppingCartDTO) throws Exception {
        Customer customer = customerConverter.fromDTO((CustomerDTO) userService.findCustomerByEmailOrUsername(newShoppingCartDTO.getCustomerEmail()));
        if(Objects.isNull(customer)) throw new ShoppingCartException("El cliente ingresado no está registrado en el sistema");
        MinShoppingCartDTO customerShoppingCart = ((CustomerDTO) userService.findCustomerByEmailOrUsername(newShoppingCartDTO.getCustomerEmail())).getShoppingCart();
        ShoppingPostDTO shoppingPostDTO = shoppingPostService.findById(newShoppingCartDTO.getShoppingPostId());
        ShoppingPost shoppingPost = shoppingPostConverter.fromDTO(shoppingPostDTO);
        Integer quantity = newShoppingCartDTO.getShoppingPostQuantity();
        ShoppingCart shoppingCart = new ShoppingCart();
        if(Objects.nonNull(customerShoppingCart)) {
            shoppingCart = shoppingCartRepository.findById(Long.valueOf(customerShoppingCart.getId())).orElse(null);
            if (shoppingCart.getShoppingPostQuantityMap().containsKey(shoppingPost)){
                Integer oldQuantity = shoppingCart.getShoppingPostQuantityMap().get(shoppingPost);
                shoppingCart.removeShoppingPost(shoppingPost, oldQuantity - quantity);
            }
            shoppingCart.setSubtotal(shoppingCart.getSubtotal() - (shoppingPost.getPrice() * quantity));
        }
        shoppingCartRepository.save(shoppingCart);
    }

    public void delete(Long id) throws ShoppingCartException {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(id).orElse(null);
        if(Objects.isNull(shoppingCart)) throw new ShoppingCartException("No existe un carrito con el id ingresado");
        shoppingCartRepository.deleteById(id);
    }

    public ShoppingCartDTO findById(Long id) throws ShoppingCartException {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(id).orElse(null);
        if(Objects.isNull(shoppingCart)) throw new ShoppingCartException("No existe un carrito con el id ingresado");
        return shoppingCartConverter.fromEntity(shoppingCart);
    }

    public ShoppingCartDTO findByCustomer(String email) throws Exception {
        Customer customer = customerConverter.fromDTO((CustomerDTO) userService.findCustomerByEmailOrUsername(email));
        if(Objects.isNull(customer)) throw new ShoppingCartException("El cliente ingresado no está registrado en el sistema");
        ShoppingCart shoppingCart = shoppingCartRepository.findById(customer.getShoppingCart().getId()).orElse(null);
        return shoppingCartConverter.fromEntity(shoppingCart);
    }

    @Transactional
    public List<ShoppingCartDTO> list() {
        return shoppingCartConverter.fromEntity((List<ShoppingCart>) shoppingCartRepository.findAll());
    }

}
