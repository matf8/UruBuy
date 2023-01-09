package com.fing.backend.rest;

import com.fing.backend.business.interfaces.IUserService;
import com.fing.backend.converter.PriceConverter;
import com.fing.backend.dao.mongo.IPhotoRepositoryNsql;
import com.fing.backend.dto.AdministratorDTO;
import com.fing.backend.dto.CustomerDTO;
import com.fing.backend.dto.SellerDTO;
import com.fing.backend.dto.UserDTO;
import com.fing.backend.dto.UserLoginDTO;

import com.fing.backend.entity.Customer;
import com.fing.backend.entity.Photo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/user")
@CrossOrigin(value = "*")
@Slf4j
public class UserRest {

    @Autowired private IUserService userService;
    @Autowired private IPhotoRepositoryNsql photoRepositoryNsql;

    @GetMapping("/ping")
    public ResponseEntity<Object> ping() {
        return new ResponseEntity<Object>("pong", HttpStatus.OK);
    }

    @PostMapping("/addCustomer")
    public ResponseEntity<Object> addCustomer(@RequestBody CustomerDTO customerDTO) {
        try {
            userService.add(customerDTO);
            return new ResponseEntity<>("Cliente agregado", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addSeller")
    public ResponseEntity<Object> addSeller(@RequestBody SellerDTO sellerDTO) {
        try {
            userService.add(sellerDTO);
            return new ResponseEntity<>("Vendedor agregado", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addAdmin")
    public ResponseEntity<Object> addAdmin(@RequestBody AdministratorDTO adminDTO) {
        try {
            userService.add(adminDTO);
            return new ResponseEntity<>("Administrador agregado", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        try {
            List<UserDTO> users = userService.list();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody UserLoginDTO userLoginDTO) {
        if (Objects.nonNull(userLoginDTO)) {
            if (Objects.nonNull(userLoginDTO.getEmail())) {
                try {
                    UserDTO u = userService.login(userLoginDTO);
                    if (Objects.nonNull(u)) {
                        // generate JWT; userLoginDTO.setToken(jwt)
                        if (u instanceof SellerDTO) {
                            userLoginDTO.setRole(((SellerDTO) u).getRole());
                            userLoginDTO.setUsername(((SellerDTO) u).getUsername());
                        } else if (u instanceof CustomerDTO) {
                            userLoginDTO.setRole(((CustomerDTO) u).getRole());
                            userLoginDTO.setUsername(((CustomerDTO) u).getUsername());
                        } else if (u instanceof AdministratorDTO)
                            userLoginDTO.setRole(((AdministratorDTO) u).getRole());
                        userLoginDTO.setPassword(null); // que no viaje la pass
                        log.info(userLoginDTO.toString());
                        return new ResponseEntity<>(userLoginDTO, HttpStatus.OK);
                    }
                } catch (Exception e) {
                    return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/signUp")
    public ResponseEntity<Object> signUpCustomer(@RequestBody CustomerDTO customerDTO) {
        if (Objects.isNull(customerDTO))
            return new ResponseEntity<>("Datos requeridos", HttpStatus.PRECONDITION_REQUIRED);
        else {
            try {
                CustomerDTO u = userService.findCustomerByEmailOrUsername(customerDTO.getEmail());
                if (Objects.nonNull(u)) {
                    if (u.getIsSuspended()) {
                        userService.reactivateAccount(u);   // si al reactivar viene con mas datos habria que modificarlos?
                        return new ResponseEntity<>("Usuario reactivado, bienvenido nuevamente", HttpStatus.OK);
                    } else
                        return new ResponseEntity<>("Usuario ya existe", HttpStatus.FORBIDDEN);
                }
            } catch (Exception e) {
                try {
                    userService.add(customerDTO);
                    return new ResponseEntity<>(HttpStatus.OK);
                } catch (Exception e2){
                    return new ResponseEntity<>(e2, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @GetMapping("/profileCustomer/{email}")
    public ResponseEntity<Object> customerProfile(@PathVariable String email) {
        try {
            if (Objects.nonNull(email)) {
                CustomerDTO u = userService.findCustomerByEmailOrUsername(email);
                if (Objects.nonNull(u)) {
                    Photo p = photoRepositoryNsql.findItemById(u.getPicture());
                    if (Objects.nonNull(p))
                        u.setPicture(p.getBase64());
                    return new ResponseEntity<>(u, HttpStatus.OK);
                }
            } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.NOT_FOUND);
        }
        return null;
    }

    @GetMapping("/profileSeller/{email}")
    public ResponseEntity<Object> sellerProfile(@PathVariable String email) {
        try {
            if (Objects.nonNull(email)) {
                SellerDTO u = userService.findSellerByEmailOrUsername(email);
                if (Objects.nonNull(u)) {
                    Photo p = photoRepositoryNsql.findItemById(u.getPicture());
                    if (Objects.nonNull(p))
                        u.setPicture(p.getBase64());
                    return new ResponseEntity<>(u, HttpStatus.OK);
                }
            } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.NOT_FOUND);
        }
        return null;
    }

    @PutMapping("/updateProfile")
    public ResponseEntity<Object> updateProfile(@RequestBody CustomerDTO u) {  // llega username y picture nomas, no importa que sea tipo CustomerDTO, es para no crear un objeto q solo tenga username y picture.
        try {
            if (Objects.nonNull(u.getUsername()) && Objects.nonNull(u.getPicture())) {
                if(u.getPicture().equals("")) { // removio foto
                    userService.deleteUserPicture(u.getUsername());
                    return new ResponseEntity<>("Foto eliminada", HttpStatus.OK);
                }
                userService.updateProfile(u.getUsername(), u.getPicture());
                return new ResponseEntity<>("Foto cambiada", HttpStatus.OK);
            } else new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/suspend/{usernameOremail}")
    public ResponseEntity<Object> suspendAccount(@PathVariable("usernameOremail") String usernameOremail) {
        try {
            if (Objects.nonNull(usernameOremail)) {
                CustomerDTO u = userService.findCustomerByEmailOrUsername(usernameOremail);
                if (Objects.nonNull(u)) {
                    if (!u.getIsSuspended()) {
                        try {
                            SellerDTO isSeller = userService.findSellerByEmailOrUsername(usernameOremail);
                            return new ResponseEntity<>("Usuario no puede ser suspendido debido a que se ha registrado como Vendedor. Contacte a la administración urubuying@gmail.com", HttpStatus.CONFLICT);
                        } catch (Exception ex) {
                            userService.suspendAccount(u);
                            return new ResponseEntity<>("Usuario suspendido.", HttpStatus.OK);
                        }
                    } else return new ResponseEntity<>("Usuario ya suspendido", HttpStatus.NOT_MODIFIED);
                }
            } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e, HttpStatus.NOT_FOUND);
        }
        return null;
    }

    @PatchMapping("/addAddressToCustomer")
    public ResponseEntity<Object> addAddressToCustomer(@RequestBody CustomerDTO customerDTO) {
        try {
            String address = customerDTO.getAddresses().get(0);
            CustomerDTO customer = userService.addAddressToCustomer(customerDTO.getEmail(), address);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteAddressCustomer/{email}/{address}")
    public ResponseEntity<Object> deleteAddressCustomer(@PathVariable("email") String email, @PathVariable("address") String address) {
        try {
            if (Objects.nonNull(email) && !email.equals("")) {
                if (Objects.nonNull(address) && !address.equals("")) {
                    CustomerDTO customer = userService.deleteAddressCustomer(email, address);
                    return new ResponseEntity<>(customer.getAddresses(), HttpStatus.OK);
                } else return new ResponseEntity<>("Dirección inválida", HttpStatus.PRECONDITION_REQUIRED);
            } else return new ResponseEntity<>("Usuario invalido", HttpStatus.PRECONDITION_REQUIRED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/isSuspended/{email}")
    public ResponseEntity<Object> isSuspended(@PathVariable("email") String email) {
        try {
            if (Objects.nonNull(email)) {
                CustomerDTO customer = userService.findCustomerByEmailOrUsername(email);
                return new ResponseEntity<>(customer.getIsSuspended(), HttpStatus.OK);
            } else return new ResponseEntity<>("Usuario invalido", HttpStatus.PRECONDITION_REQUIRED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

//
//    @GetMapping("/searchUserId/{id}")
//    public ResponseEntity<Object> searchUserId(@PathVariable String id) {
//        if (id == null)
//            return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
//        else {
//            try {
//                List<UserDTO> lu = userService.searchUserId(id);
//                if (lu != null)
//                    return new ResponseEntity<>(lu, HttpStatus.OK);
//                else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            } catch (Exception e) {
//                e.printStackTrace();
//                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//        }
//    }
//
//    @GetMapping("/searchUser/{value}")
//    public ResponseEntity<Object> searchUser(@PathVariable String value) throws Exception {
//        if (value == null)
//            return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
//        else {
//            try {
//                List<UserDTO> u = userService.searchUser(value);
//                if (u != null)
//                    return new ResponseEntity<>(u, HttpStatus.OK);
//                else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            } catch (Exception e) {
//                e.printStackTrace();
//                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//        }
//    }
//
//    // idUsuario a editar no se puede modificar
//    @PutMapping("/editCustomer")
//    public ResponseEntity<Object> editCustomer(@RequestBody CustomerDTO u) {
//        try {
//            us.editCustomer(u);
//            return new ResponseEntity<>(u, HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @PutMapping("/editSeller")
//    public ResponseEntity<Object> editSeller(@RequestBody SellerDTO u) {
//        try {
//            userService.editSeller(u);
//            return new ResponseEntity<>(u, HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @PutMapping("/editAdmin")
//    public ResponseEntity<Object> editAdmin(@RequestBody AdminDTO u) {
//        try {
//            userService.editAdmin(u);
//            return new ResponseEntity<>(u, HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @DeleteMapping("/deleteCustomer/{value}")
//    public ResponseEntity<Object> deleteCustomer(@PathVariable String value) throws Exception {
//        if (value == null)
//            return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
//        else {
//            try {
//                userService.deleteCustomer(value);
//                return new ResponseEntity<>("Borrado con exito", HttpStatus.OK);
//            } catch (Exception e) {
//                e.printStackTrace();
//                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//        }
//    }
//
//    @DeleteMapping("/deleteSeller/{value}")
//    public ResponseEntity<Object> deleteSeller(@PathVariable String value) throws Exception {
//        if (value == null)
//            return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
//        else {
//            try {
//                userService.deleteSeller(value);
//                return new ResponseEntity<>("Borrado con exito", HttpStatus.OK);
//            } catch (Exception e) {
//                e.printStackTrace();
//                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//        }
//    }
//
//    @DeleteMapping("/deleteAdmin/{value}")
//    public ResponseEntity<Object> deleteAdmin(@PathVariable String value) throws Exception {
//        if (value == null)
//            return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
//        else {
//            try {
//                userService.deleteAdmin(value);
//                return new ResponseEntity<>("Borrado con exito", HttpStatus.OK);
//            } catch (Exception e) {
//                e.printStackTrace();
//                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//        }
//    }
