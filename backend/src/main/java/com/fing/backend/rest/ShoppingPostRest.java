package com.fing.backend.rest;

import com.fing.backend.business.interfaces.IShoppingPostService;
import com.fing.backend.dto.NewShoppingPostDTO;
import com.fing.backend.dto.ShoppingPostDTO;
import com.fing.backend.exception.ShoppingPostException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/shoppingPost")
@CrossOrigin(value = "*")
@Slf4j
public class ShoppingPostRest {

    @Autowired private IShoppingPostService shoppingPostService;

    @PostMapping("/add")
    public ResponseEntity<Object> add(@RequestBody NewShoppingPostDTO newShoppingPostDTO) {
        try {
            shoppingPostService.add(newShoppingPostDTO);
            return new ResponseEntity<>("ShoppingPost agregado correctamente", HttpStatus.OK);
        } catch (ShoppingPostException shoppingPostException){
            shoppingPostException.printStackTrace();
            return new ResponseEntity<>(shoppingPostException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        try {
            List<ShoppingPostDTO> shoppingPosts = shoppingPostService.list();
            return new ResponseEntity<>(shoppingPosts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            if (Objects.nonNull(id)){
                ShoppingPostDTO ret = shoppingPostService.findById(Long.valueOf(id));
                return new ResponseEntity<>(ret, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ShoppingPostException shoppingPostException){
            shoppingPostException.printStackTrace();
            return new ResponseEntity<>(shoppingPostException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<Object> updateStatus(@RequestBody ShoppingPostDTO shoppingPostDTO){
        try{
            if (Objects.nonNull(shoppingPostDTO)){
               return new ResponseEntity<>(shoppingPostService.updateStatus(shoppingPostDTO), HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ShoppingPostException shoppingPostException) {
            return new ResponseEntity<>(shoppingPostException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Object> update(@RequestBody ShoppingPostDTO shoppingPostDTO) {
        try {
            if (Objects.nonNull(shoppingPostDTO)) {
                return new ResponseEntity<>(shoppingPostService.update(shoppingPostDTO), HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ShoppingPostException shoppingPostException) {
            return new ResponseEntity<>(shoppingPostException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addList")
    public ResponseEntity<Object> addFromList(@RequestBody List<NewShoppingPostDTO> list) {
        try {
            list.forEach(x -> {
                try {
                    shoppingPostService.add(x);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/requestPage/{page}")
    public List<ShoppingPostDTO> pageShoppingPost(@PathVariable("page") Integer page) {
        return shoppingPostService.listPaged(page);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable("id") String id) throws Exception {
        if (id == null)
            return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        else {
            try {
                shoppingPostService.delete(Long.valueOf(id));
                return new ResponseEntity<>("Borrado con exito", HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
