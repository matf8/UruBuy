package com.fing.backend.rest;

import com.fing.backend.business.interfaces.IPurchaseService;
import com.fing.backend.dto.PurchaseDTO;
import com.fing.backend.exception.PurchaseException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/purchase")
@CrossOrigin(value = "*")
@Slf4j
public class PurchaseRest {

    @Autowired private IPurchaseService purchaseService;

    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        try {
            List<PurchaseDTO> ret = purchaseService.list();
            return new ResponseEntity<>(ret, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return new ResponseEntity<>(purchaseService.findById(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<Object> updateStatus(@RequestBody PurchaseDTO purchaseDTO){
        try{
            if (Objects.nonNull(purchaseDTO)){
                return new ResponseEntity<>(purchaseService.updateStatus(purchaseDTO), HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (PurchaseException purchaseException) {
            return new ResponseEntity<>(purchaseException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
