package com.fing.sideco.rest;

import com.fing.sideco.business.interfaces.IIdCardService;
import com.fing.sideco.entity.NewIdCard;
import com.fing.sideco.entity.OldIdCard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Objects;

@RestController
@RequestMapping("/v1")
@CrossOrigin("*")
public class SidecoRest {

    @Autowired private IIdCardService ics;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/ping")
    public ResponseEntity<Object> ping() {
        return new ResponseEntity<Object>("pong", HttpStatus.OK);
    }

    // old id card
    @PostMapping("/addOldCard")
    public ResponseEntity<Object> addOldIdCard(@RequestBody OldIdCard u) {
        try {
            if (Objects.nonNull(u)) {
                ics.addOldIdCard(u);
                return new ResponseEntity<Object>("OldIdCard ingresado correctamente", HttpStatus.OK);
            } else return new ResponseEntity<Object>( HttpStatus.PRECONDITION_FAILED);
        } catch (Exception e) {
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getOldIdCard/{personalId}/{serie}/{folioNumber}")
    public ResponseEntity<Object> getOLdIdCard(@PathVariable("personalId") String personalId, @PathVariable("serie") String serie, @PathVariable("folioNumber") Integer folioNumber) {
        try{
            return new ResponseEntity<Object>(ics.getOldIdCards(personalId, serie.toUpperCase(Locale.ROOT), folioNumber), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/listOldIdCards")
    public ResponseEntity<Object> getOldIdCards() {
        try {
            return new ResponseEntity<Object>(ics.getOldIdCards(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/editOldIdCard") // no lo veo necesario, pero lo dejo
    public ResponseEntity<Object> editOldIdCard(@RequestBody OldIdCard u) {
        try {
            if (Objects.nonNull(u)) {
                ics.editOldIdCard(u);
                return new ResponseEntity<Object>("OldIdCard editado correctamente", HttpStatus.OK);
            } else return new ResponseEntity<Object>( HttpStatus.PRECONDITION_FAILED);
        } catch (Exception e) {
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping ("/deleteOldIdCard/{personalId}") // no lo veo necesario, pero lo dejo
    public ResponseEntity<Object> deleteOldIdCard(@PathVariable("personalId") String personalId) {
        try {
            if (Objects.nonNull(personalId)) {
                ics.deleteOldIdCard(personalId);
                return new ResponseEntity<Object>("OldIdCard borrado correctamente", HttpStatus.OK);
            } else return new ResponseEntity<Object>( HttpStatus.PRECONDITION_FAILED);
        } catch (Exception e) {
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // new id card

    @PostMapping("/addNewIdCard")
    public ResponseEntity<Object> addNewIdCard(@RequestBody NewIdCard i) {
        System.out.printf("llegue al rest");
        try {
            if (Objects.nonNull(i)) {
                ics.addNewIdCard(i);
                return new ResponseEntity<Object>("NewIdCard ingresado correctamente", HttpStatus.OK);
            } else return new ResponseEntity<Object>( HttpStatus.PRECONDITION_FAILED);
        } catch (Exception e) {
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/getNewIdCard/{personalId}/{secureCode}")
    public ResponseEntity<Object> getNewIdCard(@PathVariable("personalId") String personalId, @PathVariable("secureCode") String secureCode) {
        try{
            System.out.println(personalId + secureCode);
            return new ResponseEntity<Object>(ics.getNewIdCard(personalId, secureCode), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/listNewIdCards")
    public ResponseEntity<Object> getNewIdCards() {
        try {
            return new ResponseEntity<Object>(ics.getNewIdCards(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}