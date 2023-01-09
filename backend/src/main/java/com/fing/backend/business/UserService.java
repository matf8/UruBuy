package com.fing.backend.business;

import com.fing.backend.business.interfaces.IReviewService;
import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.converter.AdministratorConverter;
import com.fing.backend.converter.CustomerConverter;
import com.fing.backend.converter.PurchaseConverter;
import com.fing.backend.converter.ReviewConverter;
import com.fing.backend.converter.SellerConverter;
import com.fing.backend.converter.UserReviewConverter;
import com.fing.backend.dao.UserRepository;
import com.fing.backend.dao.mongo.IPhotoRepositoryNsql;
import com.fing.backend.dto.AdministratorDTO;
import com.fing.backend.dto.CustomerDTO;
import com.fing.backend.dto.PurchaseDTO;
import com.fing.backend.dto.ReviewDTO;
import com.fing.backend.dto.UserDTO;
import com.fing.backend.dto.SellerDTO;
import com.fing.backend.dto.UserLoginDTO;
import com.fing.backend.dto.UserReviewDTO;
import com.fing.backend.entity.Administrator;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.Photo;
import com.fing.backend.entity.Purchase;
import com.fing.backend.entity.Review;
import com.fing.backend.entity.Seller;
import com.fing.backend.entity.User;
import com.fing.backend.entity.UserReview;
import com.fing.backend.exception.ReviewException;
import com.fing.backend.exception.UserException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UserService implements IUserService {

    @Autowired private UserRepository userRepository;
    @Autowired private IPhotoRepositoryNsql iPhotoRepositoryNsql;
    private final UserReviewConverter userReviewConverter = UserReviewConverter.getInstance();
    private final CustomerConverter customerConverter = CustomerConverter.getInstance();
    private final SellerConverter sellerConverter = SellerConverter.getInstance();
    private final AdministratorConverter administratorConverter = AdministratorConverter.getInstance();
    private final PurchaseConverter purchaseConverter = PurchaseConverter.getInstance();
    @Autowired private IReviewService reviewService;

    @Transactional
    public UserDTO add(UserDTO user) throws Exception {
        if (Objects.nonNull(user)) {
            user.setPassword(encriptPass(user.getPassword()));
            if (user instanceof CustomerDTO) {
                // TODO: chequear si es el unico customer con ese email y username
                if (Objects.nonNull(((CustomerDTO) user).getPicture()) && !((CustomerDTO) user).getPicture().equals("")) {
                    String id = uploadPictureId(((CustomerDTO) user).getPicture(), ((CustomerDTO) user).getUsername());
                    ((CustomerDTO) user).setPicture(id);
                }
                Customer customer = customerConverter.fromDTO((CustomerDTO) user);
                List<UserReview> givenUserReviews = new ArrayList<>();
                customer.setGivenUserReviews(givenUserReviews);
                return customerConverter.fromEntity((Customer) userRepository.add(customer));
            } else if (user instanceof SellerDTO) {
                Customer c = findCustomerObjectByEmailOrUsername(user.getEmail());
                Seller seller = sellerConverter.fromDTO((SellerDTO) user);
                seller.setPictureId(c.getPictureId());
                return sellerConverter.fromEntity((Seller) userRepository.add(seller));
            } else if (user instanceof AdministratorDTO) {
                // TODO: chequear si es el unico administrator con ese email
                Administrator admin = administratorConverter.fromDTO((AdministratorDTO) user);
                return administratorConverter.fromEntity((Administrator) userRepository.add(admin));
            }
            return null;
        } else throw new UserException("Dato null");
    }

    public CustomerDTO findCustomerByEmailOrUsername(String value) throws UserException, ReviewException {
        Customer customer =  userRepository.findCustomerByEmailOrUsername(value);
        CustomerDTO customerDTO = customerConverter.fromEntity(customer);
        List<UserReview> givenUserReviews = customer.getGivenUserReviews();
        List<UserReview> receivedUserReviews = customer.getReceivedUserReviews();
        List<Purchase> purchases = customer.getPurchases();
        List<Review> reviews = customer.getGivenReviews();
        List<UserReviewDTO> givenUserReviewDTOs = new ArrayList<>();
        List<UserReviewDTO> receivedUserReviewDTOs = new ArrayList<>();
        List<PurchaseDTO> purchaseDTOS = new ArrayList<>();
        List<ReviewDTO> reviewDTOs = new ArrayList<>();

        if (Objects.nonNull(givenUserReviews)){
            givenUserReviewDTOs = userReviewConverter.fromEntity(givenUserReviews);
        }
        if(Objects.nonNull(receivedUserReviews)){
            receivedUserReviewDTOs = userReviewConverter.fromEntity(receivedUserReviews);
        }
        if(Objects.nonNull(purchases)){
            purchaseDTOS = purchaseConverter.fromEntity(purchases);
        }
        if(Objects.nonNull(reviews)){
            for(Review review: reviews){
                reviewDTOs.add(reviewService.findById(review.getId()));
            }
        }

        customerDTO.setGivenUserReviews(givenUserReviewDTOs);
        customerDTO.setReceivedUserReviews(receivedUserReviewDTOs);
        customerDTO.setPurchases(purchaseDTOS);
        customerDTO.setGivenReviews(reviewDTOs);
        return customerDTO;
    }

    public SellerDTO findSellerByEmailOrUsername(String value) throws UserException {
        Seller seller =  userRepository.findSellerByEmailOrUsername(value);
        SellerDTO sellerDTO = sellerConverter.fromEntity(seller);
        List<UserReview> givenUserReviews = seller.getGivenUserReviews();
        List<UserReview> receivedUserReviews = seller.getReceivedUserReviews();
        List<UserReviewDTO> givenUserReviewDTOs = new ArrayList<>();
        List<UserReviewDTO> receivedUserReviewDTOs = new ArrayList<>();
        List<Purchase> sales = seller.getSales();
        List<PurchaseDTO> salesDTOs = new ArrayList<>();

        if (Objects.nonNull(givenUserReviews)){
            givenUserReviewDTOs = userReviewConverter.fromEntity(givenUserReviews);
        }
        if(Objects.nonNull(receivedUserReviews)){
            receivedUserReviewDTOs = userReviewConverter.fromEntity(receivedUserReviews);
        }
        if(Objects.nonNull(sales)){
            salesDTOs = purchaseConverter.fromEntity(sales);
        }

        sellerDTO.setGivenUserReviews(givenUserReviewDTOs);
        sellerDTO.setReceivedUserReviews(receivedUserReviewDTOs);
        sellerDTO.setSales(salesDTOs);
        return sellerDTO;
    }

    @Transactional
    public Customer findCustomerObjectByEmailOrUsername (String value) throws UserException {
        return userRepository.findCustomerByEmailOrUsername(value);
    }

    @Transactional
    public Seller findSellerObjectByEmailOrUsername (String value) throws UserException {
        return userRepository.findSellerByEmailOrUsername(value);
    }

    public UserDTO login(UserLoginDTO user) throws Exception {
        if (Objects.nonNull(user)) {
            try {
                if (Objects.nonNull(user.getEmail())) {
                    UserDTO u = findCustomerByEmailOrUsername(user.getEmail());
                    if (Objects.nonNull(u) && Objects.nonNull(user.getPassword())) {
                        if (checkPass(u.getPassword(), user.getPassword())) {  // hash, plain
                            return u;
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new UserException("Login incorrecto");
            }
        }
        return null;
    }

    @Transactional
    public List<UserDTO> list() {
        List<UserDTO> usersDTO = new ArrayList<>();
        List<User> users = userRepository.list();
        for(User u: users){
            if (u instanceof Customer){
                usersDTO.add(customerConverter.fromEntity((Customer) u));
            }else if (u instanceof Seller){
                usersDTO.add(sellerConverter.fromEntity((Seller) u));
            }else{
                usersDTO.add(administratorConverter.fromEntity((Administrator) u));
            }
        }
        return usersDTO;
    }

    public CustomerDTO addAddressToCustomer (String email, String address) throws UserException {
        Customer customer = userRepository.findCustomerByEmailOrUsername(email);
        if (Objects.isNull(customer)) throw new UserException("No existe usuario registrado con el email ingresado");
        List<String> addresses = customer.getAddresses();
        for (String el: addresses){
            if (el.equals(address)) throw new UserException("La dirección ingresada ya está registrada en las direcciones del cliente");
        }
        addresses.add(address);
        customer.setAddresses(addresses);
        return customerConverter.fromEntity((Customer) userRepository.edit(customer));
    }

    public CustomerDTO deleteAddressCustomer (String email, String address) throws Exception {
        try {
            Customer customer = userRepository.findCustomerByEmailOrUsername(email);
            if (Objects.isNull(customer))
                throw new UserException("No existe usuario registrado con el email ingresado");
            List<String> addresses = customer.getAddresses();
            if (addresses.contains(address)) {
                addresses.remove(address);
                userRepository.edit(customer);
            } else throw new UserException("La dirección ingresada no está registrada en las direcciones del cliente");
            return customerConverter.fromEntity((Customer) userRepository.edit(customer));
        } catch (Exception e) {
            throw e;
        }
    }

    public void updateProfile(String username, String base64) throws Exception { // only picture
        try {
            if (Objects.nonNull(username) && !username.equals("")) {
                if (Objects.nonNull(base64) && !base64.equals("")) {
                    Photo p = iPhotoRepositoryNsql.findItemByUsername(username);
                    if (Objects.nonNull(p) && !p.getBase64().equals("")) {
                        p.setBase64(base64);
                        iPhotoRepositoryNsql.save(p);
                    } else {
                        List<User> usr = userRepository.searchUser(username);
                        if (usr == null)
                            throw new Exception("Usuario no existe");
                        else {
                            String id = uploadPictureId(base64, username);
                            usr.forEach(user -> {
                                if (user instanceof Customer)
                                    ((Customer) user).setPictureId(id);
                                else if (user instanceof Seller)
                                    ((Seller) user).setPictureId(id);
                                try {
                                    userRepository.updateProfile(user);
                                } catch (Exception e) {
                                    throw new RuntimeException(e);
                                }
                            });
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    public void deleteUserPicture(String username) throws Exception {
        List<User> usr = userRepository.searchUser(username);
        if (usr == null)
            throw new Exception("Usuario no existe");
        else {
            try {
                Photo p = iPhotoRepositoryNsql.findItemByUsername(username);
                if (Objects.nonNull(p)) {
                    iPhotoRepositoryNsql.delete(p);
                    usr.forEach(user -> {
                        if (user instanceof Customer)
                            ((Customer) user).setPictureId(null);
                        else if (user instanceof Seller)
                            ((Seller) user).setPictureId(null);
                        try {
                            userRepository.updateProfile(user);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    });
                }
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public void suspendAccount(CustomerDTO c) throws UserException {
        if (Objects.nonNull(c))
            if (!c.getIsSuspended())
                userRepository.manageAccountSuspend(customerConverter.fromDTO(c), true);
    }

    public void reactivateAccount(CustomerDTO c) throws UserException {
        if (Objects.nonNull(c))
            if (c.getIsSuspended())
                userRepository.manageAccountSuspend(customerConverter.fromDTO(c), false);
    }

    private boolean checkPass(String hash, String p) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(p, hash);
    }

    private String encriptPass(String password) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }

    private String uploadPictureId(String picture, String username){
        Photo p = new Photo();
        p.setUsername(username);
        p.setBase64(picture);
        iPhotoRepositoryNsql.save(p);
        return p.getId();
    }

    private String customerDTOToString(CustomerDTO customer) {
        return "CompradorDTO (id = " + customer.getId()
                + ", correo = " + customer.getEmail()
                + ", username = " + customer.getUsername()
                + ", calificación = " + customer.getAverageRating()
                + ", isBlocked = " + customer.getIsBlocked()
                + ", direcciones = " + customer.getAddresses();
    }

    public String sellerDTOToString(SellerDTO seller) {
        return "VendedorDTO (id = " + seller.getId()
                + ", correo = " + seller.getEmail()
                + ", username = " + seller.getUsername()
                + ", calificación = " + seller.getAverageRating()
                + ", isBlocked = " + seller.getIsBlocked()
                + ", direcciones = " + seller.getAddresses()
                + ", barcode = "  + seller.getBarcode()
                + ", personalId = " + seller.getPersonalId()
                + ", nombre = " + seller.getFirstName() + " " + seller.getLastName();
    }

    public String administratorDTOToString(AdministratorDTO admin){
        return "VendedorDTO (id = " + admin.getId()
                + ", correo = " + admin.getEmail()
                + ", rol = " + admin.getRole();
    }

    public void addUserReview(Customer customer, Seller seller) {
        userRepository.edit(customer);
        userRepository.edit(seller);
    }

    public void addReview(Customer customer){
        userRepository.edit(customer);
    }
}


//    public List<UserDTO> searchUserId(String id) throws Exception {
//        if (Objects.nonNull(id))
//            return userRepository.searchUserId(id);
//        else throw new UserException("Id es null");
//    }
//

//
//    public UserDTO editCustomer(CustomerDTO u) throws Exception {
//        if (Objects.nonNull(u))
//            userRepository.editCustomer(u);
//        return u;
//    }
//
//    public UserDTO editSeller(SellerDTO u) throws Exception {
//        if (Objects.nonNull(u))
//            userRepository.editSeller(u);
//        return u;
//    }
//
//    public UserDTO editAdmin(AdminDTO u) throws Exception {
//        if (Objects.nonNull(u))
//            userRepository.editAdmin(u);
//        return u;
//    }
//
//    // borra por id, correo o username
//    public void deleteCustomer(String value) throws Exception {
//        if (Objects.nonNull(value))
//            userRepository.deleteCustomer(value);
//    }
//
//    public void deleteSeller(String value) throws Exception {
//        if (Objects.nonNull(value))
//            userRepository.deleteSeller(value);
//    }
//
//    public void deleteAdmin(String value) throws Exception {
//        if (Objects.nonNull(value))
//            userRepository.deleteAdmin(value);
//    }
//
