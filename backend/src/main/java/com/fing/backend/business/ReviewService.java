package com.fing.backend.business;

import com.fing.backend.business.interfaces.IReviewService;
import com.fing.backend.business.interfaces.IShoppingPostService;
import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.converter.ReviewConverter;
import com.fing.backend.dao.IReviewRepository;
import com.fing.backend.dao.mongo.IPhotoRepositoryNsql;
import com.fing.backend.dto.NewReviewDTO;
import com.fing.backend.dto.ReviewDTO;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.Photo;
import com.fing.backend.entity.Review;
import com.fing.backend.entity.ShoppingPost;
import com.fing.backend.exception.ReviewException;
import com.fing.backend.exception.ShoppingPostException;
import com.fing.backend.exception.UserReviewException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ReviewService implements IReviewService {

    @Autowired private IReviewRepository reviewRepository;
    @Autowired private IPhotoRepositoryNsql photoRepositoryNsql;
    @Autowired private IUserService userService;
    @Autowired private IShoppingPostService shoppingPostService;
    private final ReviewConverter reviewConverter = ReviewConverter.getInstance();

    public void add(NewReviewDTO newReviewDTO) throws Exception{
        Customer customer = userService.findCustomerObjectByEmailOrUsername(newReviewDTO.getCustomerEmail());
        if (Objects.isNull(customer)) throw new UserReviewException("El cliente ingresado no existe");
        ShoppingPost shoppingPost = shoppingPostService.findObjectById(Long.valueOf(newReviewDTO.getShoppingPostId()));
        if (Objects.isNull(shoppingPost)) throw new ShoppingPostException("La publicación ingresada no existe");
        Review review = reviewConverter.fromNewDTO(newReviewDTO);
        review.setCustomer(customer);
        review.setShoppingPost(shoppingPost);
        reviewRepository.save(review);
        // Se guardan las fotos en Mongo
        List<String> base64Images = newReviewDTO.getBase64Images();
        List<String> photosIdMongo = new ArrayList<>();
        for (String image: base64Images) {
            Photo photo = new Photo();
            photo.setBase64(image);
            photo.setIdReview(review.getId());
            photoRepositoryNsql.save(photo);
            photosIdMongo.add(photo.getId());
        }
        review.setPhotosIdMongo(photosIdMongo);
        reviewRepository.save(review);

        customer.getGivenReviews().add(review);
        List<Review> reviews = shoppingPost.getReviews();
        reviews.add(review);
        shoppingPost.setReviews(reviews);
        shoppingPost.setAverageRating(calculateAverageRating(reviews));
        userService.addReview(customer);
        shoppingPostService.updateObject(shoppingPost);
    }

    @Transactional
    public ReviewDTO findById(Long id) throws ReviewException {
        Review review = reviewRepository.findById(id).orElse(null);
        if(Objects.isNull(review)) throw new ReviewException("No existe un Review con el id ingresado");
        List<String> photosIdMongo = review.getPhotosIdMongo();
        ReviewDTO reviewDTO =  reviewConverter.fromEntity(review);
        if(photosIdMongo.isEmpty())
            return reviewDTO;
        List<String> base64Images = new ArrayList<>();
        photosIdMongo.forEach(photoId -> base64Images.add(photoRepositoryNsql.findItemById(photoId).getBase64()));
        reviewDTO.setBase64Images(base64Images);
        return reviewDTO;
    }

    @Transactional
    public List<ReviewDTO> list(){
        List<Review> reviews = (List<Review>) reviewRepository.findAll();
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        List<String> photosIdMongo;
        for (Review review: reviews){
            List<String> base64Images = new ArrayList<>();
            photosIdMongo = review.getPhotosIdMongo();
            for (String photoId: photosIdMongo) {
                Photo photo = photoRepositoryNsql.findItemById(photoId);
                if (Objects.nonNull(photo) && Objects.equals(photo.getIdShoppingPost(), review.getId()))
                    base64Images.add(photo.getBase64());
            }
            ReviewDTO reviewDTO = reviewConverter.fromEntity(review);
            reviewDTO.setBase64Images(base64Images);
            reviewDTOS.add(reviewDTO);
        }
        return reviewDTOS;
    }

    public Boolean alreadyReviewed(String customerEmail, Long shoppingPostId) {
        List<Review> reviews = (List<Review>) reviewRepository.findAll();
        for(Review review: reviews){
            if (review.getCustomer().getEmail().equals(customerEmail) && review.getShoppingPost().getId().equals(shoppingPostId))
                return true;
        }
        return false;
    }

    private Float calculateAverageRating(List<Review> reviews){
        Float sum = Float.valueOf(0);
        for(Review review:reviews){
            Integer rating = review.getRating();
            sum += rating;
        }
        return sum / reviews.size();
    }
}
