package com.fing.backend.business;

import com.fing.backend.business.interfaces.IPurchaseService;
import com.fing.backend.business.interfaces.IUserReviewService;
import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.converter.UserReviewConverter;
import com.fing.backend.dao.IUserReviewRepository;
import com.fing.backend.dao.UserRepository;
import com.fing.backend.dto.NewUserReviewDTO;
import com.fing.backend.dto.UserReviewDTO;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.Purchase;
import com.fing.backend.entity.Seller;
import com.fing.backend.entity.UserReview;
import com.fing.backend.exception.PurchaseException;
import com.fing.backend.exception.UserReviewException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UserReviewService implements IUserReviewService {

    @Autowired private IUserReviewRepository userReviewRepository;
    @Autowired private IUserService userService;
    @Autowired private IPurchaseService purchaseService;
    private final UserReviewConverter userReviewConverter = UserReviewConverter.getInstance();

    public void add(NewUserReviewDTO newUserReviewDTO) throws Exception{
        Customer customer = userService.findCustomerObjectByEmailOrUsername(newUserReviewDTO.getCustomerEmail());
        if (Objects.isNull(customer)) throw new UserReviewException("El cliente ingresado no existe");
        Seller seller = userService.findSellerObjectByEmailOrUsername(newUserReviewDTO.getSellerEmail());
        if (Objects.isNull(seller)) throw new UserReviewException("El vendedor ingresado no existe");
        Purchase purchase = purchaseService.findObjectById(newUserReviewDTO.getPurchaseId());
        if (Objects.isNull(purchase)) throw new PurchaseException("La compra ingresada no existe");
        UserReview userReview = userReviewConverter.fromNewDTO(newUserReviewDTO);
        userReview.setCustomer(customer);
        userReview.setSeller(seller);
        userReviewRepository.save(userReview);
        List<UserReview> receivedUserReviews = new ArrayList<>();
        if (newUserReviewDTO.getFrom().equals("CUSTOMER")){
            customer.getGivenUserReviews().add(userReview);
            receivedUserReviews = seller.getReceivedUserReviews();
            receivedUserReviews.add(userReview);
            seller.setReceivedUserReviews(receivedUserReviews);
            seller.setAverageRating(calculateAverageRating(receivedUserReviews));
            purchase.setCustomerReview(userReview);
        } else{
            seller.getGivenUserReviews().add(userReview);
            receivedUserReviews = customer.getReceivedUserReviews();
            receivedUserReviews.add(userReview);
            customer.setReceivedUserReviews(receivedUserReviews);
            customer.setAverageRating(calculateAverageRating(receivedUserReviews));
            purchase.setSellerReview(userReview);
        }
        userService.addUserReview(customer, seller);
        purchaseService.update(purchase);
    }

    public UserReviewDTO findById(Long id) throws UserReviewException{
        UserReview userReview = userReviewRepository.findById(id).orElse(null);
        if(Objects.isNull(userReview)) throw new UserReviewException("No existe un UserReview con el id ingresado");
        return userReviewConverter.fromEntity(userReview);
    }

    public List<UserReviewDTO> list(){
        return userReviewConverter.fromEntity((List<UserReview>) userReviewRepository.findAll());
    }

    private Float calculateAverageRating(List<UserReview> receivedUserReviews){
        Float sum = Float.valueOf(0);
        for(UserReview review:receivedUserReviews){
            Integer rating = review.getRating();
            sum += rating;
        }
        return sum / receivedUserReviews.size();
    }
}
