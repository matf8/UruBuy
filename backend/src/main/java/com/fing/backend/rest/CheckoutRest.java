package com.fing.backend.rest;

import com.fing.backend.business.interfaces.ICheckoutService;
import com.fing.backend.dto.CheckoutDTO;
import com.fing.backend.dto.NewCheckoutDTO;
import com.fing.backend.exception.CheckoutException;
import com.fing.backend.exception.ShoppingCartException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/checkout")
@CrossOrigin(value = "*")
@Slf4j
public class CheckoutRest {

    @Autowired
    private ICheckoutService checkoutService;

    @PostMapping("/addOrUpdate")
    public ResponseEntity<Object> add(@RequestBody NewCheckoutDTO checkoutDTO) {
        try {
            Long id = checkoutService.addOrUpdate(checkoutDTO);
            return new ResponseEntity<>(id, HttpStatus.OK);
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
            List<CheckoutDTO> checkoutDTOS = checkoutService.list();
            return new ResponseEntity<>(checkoutDTOS, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            CheckoutDTO checkoutDTO = checkoutService.findById(Long.valueOf(id));
            return new ResponseEntity<>(checkoutDTO, HttpStatus.OK);
        } catch (CheckoutException checkoutException){
            checkoutException.printStackTrace();
            return new ResponseEntity<>(checkoutException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("ShoppingCart no encontrado", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        try {
            if (Objects.nonNull(id)) {
                checkoutService.delete(Long.valueOf(id));
                return new ResponseEntity<>("Checkout borrado correctamente", HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        } catch (CheckoutException checkoutException){
            checkoutException.printStackTrace();
            return new ResponseEntity<>(checkoutException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
