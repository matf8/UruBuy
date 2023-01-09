package com.fing.backend.rest;

import com.fing.backend.business.interfaces.IUserReviewService;
import com.fing.backend.dto.NewUserReviewDTO;
import com.fing.backend.dto.UserReviewDTO;
import com.fing.backend.exception.UserReviewException;
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
@RequestMapping("/userReview")
@CrossOrigin(value = "*")
@Slf4j
public class UserReviewRest {

    @Autowired private IUserReviewService userReviewService;

    @PostMapping("/add")
    public ResponseEntity<Object> add(@RequestBody NewUserReviewDTO newUserReviewDTO) {
        try {
            userReviewService.add(newUserReviewDTO);
            return new ResponseEntity<>("UserReview creado correctamente", HttpStatus.OK);
        }
        catch (UserReviewException userReviewException){
            userReviewException.printStackTrace();
            return new ResponseEntity<>(userReviewException.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        try {
            List<UserReviewDTO> userReviews = userReviewService.list();
            return new ResponseEntity<>(userReviews, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            if (Objects.nonNull(id)){
                UserReviewDTO userReview = userReviewService.findById(Long.valueOf(id));
                return new ResponseEntity<>(userReview, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (UserReviewException userReviewException){
            userReviewException.printStackTrace();
            return new ResponseEntity<>(userReviewException.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
