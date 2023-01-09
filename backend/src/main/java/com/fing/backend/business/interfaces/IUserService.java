package com.fing.backend.business.interfaces;


import com.fing.backend.dto.CustomerDTO;
import com.fing.backend.dto.SellerDTO;
import com.fing.backend.dto.UserDTO;
import com.fing.backend.dto.UserLoginDTO;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.Seller;
import com.fing.backend.exception.ReviewException;
import com.fing.backend.exception.UserException;

import java.util.List;
import java.util.Objects;

public interface IUserService {

    UserDTO add(UserDTO u) throws Exception;
    List<UserDTO> list();
    CustomerDTO findCustomerByEmailOrUsername(String atr) throws UserException, ReviewException;
    SellerDTO findSellerByEmailOrUsername(String value) throws UserException;
    Customer findCustomerObjectByEmailOrUsername (String value) throws UserException;
    Seller findSellerObjectByEmailOrUsername (String value) throws UserException;
    UserDTO login(UserLoginDTO user) throws Exception;
    CustomerDTO addAddressToCustomer (String email, String address) throws UserException;
    CustomerDTO deleteAddressCustomer (String email, String address) throws Exception;
    void addUserReview(Customer customer, Seller seller);
    void addReview(Customer customer);
    void updateProfile(String username, String base64) throws Exception;
    void deleteUserPicture(String username) throws Exception;
    void suspendAccount(CustomerDTO c) throws UserException;
    void reactivateAccount(CustomerDTO c) throws UserException;

}
//    List<UserDTO> searchUserId(String id) throws Exception;
//    List<UserDTO> searchUser(String atr) throws Exception;
//    void deleteCustomer(String value) throws Exception;
//    void deleteSeller(String value) throws Exception;
//    void deleteAdmin(String value) throws Exception;
//    UserDTO editCustomer(CustomerDTO u) throws Exception;
//
//    UserDTO editSeller(SellerDTO u) throws Exception;
//    UserDTO editAdmin(AdminDTO u) throws Exception;

