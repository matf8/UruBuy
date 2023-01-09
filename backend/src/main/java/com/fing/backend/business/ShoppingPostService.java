package com.fing.backend.business;

import com.fing.backend.business.interfaces.ICategoryService;
import com.fing.backend.business.interfaces.IReviewService;
import com.fing.backend.business.interfaces.IShoppingPostService;
import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.converter.CategoryConverter;
import com.fing.backend.converter.SellerConverter;
import com.fing.backend.converter.ShoppingPostConverter;
import com.fing.backend.dao.IShoppingPostPagination;
import com.fing.backend.dao.IShoppingPostRepository;
import com.fing.backend.dao.mongo.IPhotoRepositoryNsql;
import com.fing.backend.dto.NewShoppingPostDTO;
import com.fing.backend.dto.ReviewDTO;
import com.fing.backend.dto.ShoppingPostDTO;
import com.fing.backend.entity.Category;
import com.fing.backend.entity.Photo;
import com.fing.backend.entity.Review;
import com.fing.backend.entity.Seller;
import com.fing.backend.entity.ShoppingPost;
import com.fing.backend.enumerate.ShoppingPostStatus;
import com.fing.backend.exception.ReviewException;
import com.fing.backend.exception.ShoppingPostException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ShoppingPostService implements IShoppingPostService {

    @Autowired private IShoppingPostRepository shoppingPostRepository;
    @Autowired private IPhotoRepositoryNsql photoRepositoryNsql;
    @Autowired private ICategoryService categoryService;
    @Autowired private IUserService userService;
    @Autowired private IReviewService reviewService;
    @Autowired private IShoppingPostPagination shoppingPostPagination;
    private final ShoppingPostConverter shoppingPostConverter = ShoppingPostConverter.getInstance();
    private final CategoryConverter categoryConverter = CategoryConverter.getInstance();
    private final SellerConverter sellerConverter = SellerConverter.getInstance();

    @Transactional
    public void add(NewShoppingPostDTO newShoppingPostDTO) throws Exception {
        Category category = categoryConverter.fromDTO(categoryService.findById(newShoppingPostDTO.getCategoryId()));
        if (Objects.isNull(category)) throw new ShoppingPostException("La categoría ingresada no existe");
        Seller seller = sellerConverter.fromDTO(userService.findSellerByEmailOrUsername(newShoppingPostDTO.getSellerEmail()));
        if (Objects.isNull(seller)) throw new ShoppingPostException("El vendedor ingresado no existe");
        ShoppingPost shoppingPost = shoppingPostConverter.fromNewDTO(newShoppingPostDTO);
        shoppingPost.setCategory(category);
        shoppingPost.setSeller(seller);
        shoppingPost.setShoppingPostStatus(ShoppingPostStatus.PUBLISHED);
        shoppingPostRepository.save(shoppingPost);

        // Se guardan las fotos en Mongo
        List<String> base64Images = newShoppingPostDTO.getBase64Images();
        List<String> photosIdMongo = new ArrayList<>();
        for (String image: base64Images) {
            Photo photo = new Photo();
            photo.setBase64(image);
            photo.setIdShoppingPost(shoppingPost.getId());
            photoRepositoryNsql.save(photo);
            photosIdMongo.add(photo.getId());
        }
        shoppingPost.setPhotosIdMongo(photosIdMongo);
        shoppingPostRepository.save(shoppingPost);
    }

    @Transactional
    public ShoppingPostDTO findById(Long id) throws ShoppingPostException, ReviewException {
        ShoppingPost shoppingPost = shoppingPostRepository.findById(id).orElse(null);
        if (Objects.isNull(shoppingPost)) throw new ShoppingPostException("No existe una publicación con el id ingresado");
        List<String> photosIdMongo = shoppingPost.getPhotosIdMongo();
        ShoppingPostDTO shoppingPostDTO = shoppingPostConverter.fromEntity(shoppingPost);
        if(photosIdMongo.isEmpty())
            return shoppingPostDTO;
        List<String> base64Images = new ArrayList<>();

        photosIdMongo.forEach(photoId -> {
            Photo photo = photoRepositoryNsql.findItemById(photoId);
            if (Objects.nonNull(photo))
                base64Images.add(photo.getBase64());
            });
        shoppingPostDTO.setBase64Images(base64Images);
        List<Review> reviews = shoppingPost.getReviews();
        List<ReviewDTO> reviewDTOs = new ArrayList<>();
        if(Objects.nonNull(reviews)){
            for(Review review: reviews){
                reviewDTOs.add(reviewService.findById(review.getId()));
            }
        }
        shoppingPostDTO.setReviews(reviewDTOs);
        return shoppingPostDTO;
    }

    @Transactional
    public ShoppingPost findObjectById(Long id){
        return shoppingPostRepository.findById(id).orElse(null);
    }

    @Transactional
    public List<ShoppingPostDTO> findAllById(List<Long> ids){
        return shoppingPostConverter.fromEntity((List<ShoppingPost>) shoppingPostRepository.findAllById(ids));
    }

    @Transactional
    public List<ShoppingPostDTO> list() {
        List<ShoppingPost> shoppingPosts = (List<ShoppingPost>) shoppingPostRepository.findAll();
        List<ShoppingPostDTO> shoppingPostDTOS = new ArrayList<>();
        List<String> photosIdMongo;
        for (ShoppingPost post: shoppingPosts){
            List<String> base64Images = new ArrayList<>();
            photosIdMongo = post.getPhotosIdMongo();
            for (String photoId: photosIdMongo) {
                Photo photo = photoRepositoryNsql.findItemById(photoId);
                if (Objects.nonNull(photo) && Objects.equals(photo.getIdShoppingPost(), post.getId()))
                    base64Images.add(photo.getBase64());
            }
            ShoppingPostDTO shoppingPostDTO = shoppingPostConverter.fromEntity(post);
            shoppingPostDTO.setBase64Images(base64Images);
            shoppingPostDTOS.add(shoppingPostDTO);
        }
        return shoppingPostDTOS;
    }

    @Transactional
    public ShoppingPostDTO updateStatus(ShoppingPostDTO shoppingPostDTO) throws ShoppingPostException {
        ShoppingPost shoppingPost = shoppingPostRepository.findById(Long.parseLong(shoppingPostDTO.getId())).orElse(null);
        if (Objects.isNull(shoppingPost)) throw new ShoppingPostException("No existe una publicación con el id ingresado");
        shoppingPost.setShoppingPostStatus(ShoppingPostStatus.valueOf(shoppingPostDTO.getShoppingPostStatus()));
        shoppingPostRepository.save(shoppingPost);
        return shoppingPostConverter.fromEntity(shoppingPost);
    }

    @Transactional
    public ShoppingPostDTO update(ShoppingPostDTO shoppingPostDTO) throws ShoppingPostException {
        ShoppingPost shoppingPost = shoppingPostRepository.findById(Long.parseLong(shoppingPostDTO.getId())).orElse(null);
        if (Objects.isNull(shoppingPost))
            throw new ShoppingPostException("No existe una publicación con el id ingresado");
        if (shoppingPostDTO.getBase64Images() != null && shoppingPostDTO.getBase64Images().size() > 0)
            shoppingPost = changePictures(shoppingPost, shoppingPostDTO.getBase64Images());
        shoppingPost.setTitle(shoppingPostDTO.getTitle());
        shoppingPost.setDescription(shoppingPostDTO.getDescription());
        shoppingPost.setPrice(shoppingPostDTO.getPrice());
        shoppingPost.setHasDelivery(shoppingPostDTO.getHasDelivery());
        shoppingPost.setDeliveryCost(shoppingPostDTO.getDeliveryCost());
        shoppingPost.setAddresses(shoppingPostDTO.getAddresses());
        shoppingPost.setStock(shoppingPostDTO.getStock());
        shoppingPost.setOnSale(shoppingPostDTO.getOnSale());
        shoppingPost.setSaleDiscount(shoppingPostDTO.getSaleDiscount());
        shoppingPost.setIsNew(shoppingPostDTO.getIsNew());
        shoppingPost.setWeight(shoppingPostDTO.getWeight());
        shoppingPostRepository.save(shoppingPost);
        return shoppingPostConverter.fromEntity(shoppingPost);
    }

    public List<ShoppingPostDTO> listPaged(Integer page) {
        Pageable paging = PageRequest.of(page, 5, Sort.by("id").ascending());
        Page<ShoppingPost> _page = shoppingPostPagination.findAll(paging);
        List<ShoppingPostDTO> ret = new ArrayList<>();
        _page.forEach(x -> {
            List<String> base64Images = new ArrayList<>();
            List<String> photosIdMongo = x.getPhotosIdMongo();
            for (String photoId: photosIdMongo) {
                Photo photo = photoRepositoryNsql.findItemById(photoId);
                if(Objects.equals(photo.getIdShoppingPost(), x.getId()))
                    base64Images.add(photo.getBase64());
            }
            ShoppingPostDTO shoppingPostDTO = shoppingPostConverter.fromEntity(x);
            shoppingPostDTO.setBase64Images(base64Images);
            ret.add(shoppingPostDTO);
        });
        return ret;
    }

    @Transactional
    public void delete(Long id) {
        shoppingPostRepository.deleteById(id);
    }

    @Transactional
    public void updateObject(ShoppingPost shoppingPost){ shoppingPostRepository.save(shoppingPost);}

    private ShoppingPost changePictures(ShoppingPost post, List<String> pictures){
        post.getPhotosIdMongo().forEach(p->{
            photoRepositoryNsql.deleteById(p);
        });

        List<String> photosIdMongo = new ArrayList<>();
        for (String image: pictures) {
            Photo photo = new Photo();
            photo.setBase64(image);
            photo.setIdShoppingPost(post.getId());
            photoRepositoryNsql.save(photo);
            photosIdMongo.add(photo.getId());
        }
        post.setPhotosIdMongo(photosIdMongo);
        return post;
    }
}
