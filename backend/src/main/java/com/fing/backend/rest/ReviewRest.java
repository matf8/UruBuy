package com.fing.backend.rest;

import com.fing.backend.business.interfaces.IReviewService;
import com.fing.backend.dto.NewReviewDTO;
import com.fing.backend.dto.ReviewDTO;
import com.fing.backend.exception.ReviewException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/review")
@CrossOrigin(value = "*")
@Slf4j
public class ReviewRest {

    @Autowired private IReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<Object> add(@RequestBody NewReviewDTO newReviewDTO) {
        try {
            if (!reviewService.alreadyReviewed(newReviewDTO.getCustomerEmail(), Long.valueOf(newReviewDTO.getShoppingPostId()))) // deberiamos mandar tmb purchaseId si queremos dejar que califique en otras compras
                reviewService.add(newReviewDTO);
            else return new ResponseEntity<>("Producto ya calificado", HttpStatus.FORBIDDEN);
            return new ResponseEntity<>("Review creado correctamente", HttpStatus.OK);
        }
        catch (ReviewException reviewException){
            reviewException.printStackTrace();
            return new ResponseEntity<>(reviewException.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        try {
            List<ReviewDTO> reviews = reviewService.list();
            return new ResponseEntity<>(reviews, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            if (Objects.nonNull(id)){
                ReviewDTO review = reviewService.findById(Long.valueOf(id));
                return new ResponseEntity<>(review, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ReviewException reviewException){
            reviewException.printStackTrace();
            return new ResponseEntity<>(reviewException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
