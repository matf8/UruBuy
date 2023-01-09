package com.fing.backend.rest;

import com.fing.backend.business.interfaces.IShoppingCartService;
import com.fing.backend.business.interfaces.IShoppingPostService;
import com.fing.backend.dto.NewShoppingCartDTO;
import com.fing.backend.dto.NewShoppingPostDTO;
import com.fing.backend.dto.ShoppingCartDTO;
import com.fing.backend.dto.ShoppingPostDTO;
import com.fing.backend.exception.ShoppingCartException;
import com.fing.backend.exception.ShoppingPostException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/shoppingCart")
@CrossOrigin(value = "*")
@Slf4j
public class ShoppingCartRest {

    @Autowired
    private IShoppingCartService shoppingCartService;

    @PostMapping("/addShoppingPost")
    public ResponseEntity<Object> addShoppingPost(@RequestBody NewShoppingCartDTO newShoppingCartDTO) {
        try {
            shoppingCartService.addShoppingPost(newShoppingCartDTO);
            return new ResponseEntity<>("ShoppingPost agregado exitosamente al carrito", HttpStatus.OK);
        } catch (ShoppingCartException shoppingCartException){
            shoppingCartException.printStackTrace();
            return new ResponseEntity<>(shoppingCartException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/removeShoppingPost")
    public ResponseEntity<Object> removeShoppingPost(@RequestBody NewShoppingCartDTO newShoppingCartDTO) {
        try {
            shoppingCartService.removeShoppingPost(newShoppingCartDTO);
            return new ResponseEntity<>("ShoppingPost borrado exitosamente del carrito", HttpStatus.OK);
        } catch (ShoppingCartException shoppingCartException){
            shoppingCartException.printStackTrace();
            return new ResponseEntity<>(shoppingCartException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        try {
            List<ShoppingCartDTO> shoppingCarts = shoppingCartService.list();
            return new ResponseEntity<>(shoppingCarts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            ShoppingCartDTO shoppingCartDTO = shoppingCartService.findById(Long.valueOf(id));
            return new ResponseEntity<>(shoppingCartDTO, HttpStatus.OK);
        } catch (ShoppingCartException shoppingCartException){
            shoppingCartException.printStackTrace();
            return new ResponseEntity<>(shoppingCartException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("ShoppingCart no encontrado", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findByCustomer/{email}")
    public ResponseEntity<Object> findByCustomer(@PathVariable String email) {
        try {
            ShoppingCartDTO shoppingCartDTO = shoppingCartService.findByCustomer(email);
            return new ResponseEntity<>(shoppingCartDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("ShoppingCart no encontrado", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        try {
            if (Objects.nonNull(id)) {
                shoppingCartService.delete(Long.valueOf(id));
                return new ResponseEntity<>("ShoppingCart borrado correctamente", HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        } catch (ShoppingCartException shoppingCartException){
            shoppingCartException.printStackTrace();
            return new ResponseEntity<>(shoppingCartException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
