package com.fing.backend.dao;

import com.fing.backend.entity.Administrator;
import com.fing.backend.entity.Seller;
import com.fing.backend.entity.User;
import com.fing.backend.entity.Customer;
import com.fing.backend.exception.UserException;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@Slf4j
public class UserRepository {

    @PersistenceContext private EntityManager em;

    @Transactional
    public User add(User user) {
        if (user instanceof Customer || user instanceof Seller || user instanceof Administrator) {
            em.persist(user);
            em.flush();
            return user;
        }
        return null;
    }

    @Transactional(rollbackFor = {Throwable.class})
    public Customer findCustomerByEmailOrUsername(String emailOrUsername) throws UserException {
        Query q;
        try {
            q = em.createQuery("select c from Customer c where c.email=:u or c.username=:u");
            q.setParameter("u", emailOrUsername);
            Customer customer = (Customer) q.getSingleResult();
            em.refresh(customer);
            if (Objects.nonNull(customer))
                return customer;
        } catch (Exception e) {
            throw new UserException("Cliente no existe con email " + emailOrUsername);
        }
        return null;
    }

    @Transactional(rollbackFor = {Throwable.class})
    public Seller findSellerByEmailOrUsername(String emailOrUsername) throws UserException {
        try {
            Query q = em.createQuery("select v from Seller v where v.email=:u or v.username=:u");
            q.setParameter("u", emailOrUsername);
            Seller seller = (Seller) q.getSingleResult();
            em.refresh(seller);
            if (Objects.nonNull(seller))
                return seller;
        } catch (Exception e) {
            throw new UserException("Vendedor no existe");
        }
        return null;
    }

    @Transactional
    public List<User> list() {
        List<User> users = new ArrayList<>();
        Query q = em.createQuery("select u from Customer u");
        List<Customer> customers = (List<Customer>) q.getResultList();
        for (Customer c: customers)
            users.add(c);

        q = em.createQuery("select u from Seller u");
        List<Seller> sellers = (List<Seller>) q.getResultList();
        for (Seller s: sellers)
            users.add(s);

        q = em.createQuery("select u from Administrator u");
        List<Administrator> admins = (List<Administrator>) q.getResultList();
        for (Administrator a: admins)
            users.add(a);
        return users;
    }

    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRES_NEW, rollbackFor = {Throwable.class})
    public User edit(User user) {
        if (user instanceof Customer || user instanceof Seller || user instanceof Administrator) {
            em.merge(user);
            em.flush();
            return user;
        }
        return null;
    }

    @Transactional(rollbackFor = {Throwable.class})
    public List<User> searchUser(String atr) {
        List<User> ret = new ArrayList<>();
        Query q;
        try {
            q = em.createQuery("select c from Customer c where c.email=:u or c.username=:u");
            q.setParameter("u", atr);
            Customer a = (Customer) q.getSingleResult();
            em.refresh(a);
            if (a != null)
                ret.add(a);
        } catch (Exception e) { }
        try {
            q = em.createQuery("select v from Seller v where v.email=:u or v.username=:u");
            q.setParameter("u", atr);
            Seller v = (Seller) q.getSingleResult();
            em.refresh(v);
            if (v != null)
                ret.add(v);
        } catch (Exception e) { }
        try {
            q = em.createQuery("select v from Administrator v where v.email=:u");
            q.setParameter("u", atr);
            Administrator ad = (Administrator) q.getSingleResult();
            em.refresh(ad);
            if (ad != null)
                ret.add(ad);
        } catch (Exception e) { }

        if (ret.size() == 0)
            return null;

        return ret;
    }

    @Transactional
    public void updateProfile(User user) throws Exception {
        try {
            if (Objects.nonNull(user))
                em.persist(user);
        } catch (Exception e) {
            throw e;
        }
    }

    @Transactional
    public Boolean settingNotifications(String user) throws Exception {
        try {
            Customer c = findCustomerByEmailOrUsername(user);
            em.refresh(c);
            if (Objects.nonNull(c)) {
                c.setNotificationsEnabled(!c.getNotificationsEnabled());
                em.persist(c);
            }
            return c.getNotificationsEnabled();
        } catch (Exception e) {
            throw e;
        }
    }

    @Transactional
    public void manageAccountSuspend(Customer c, Boolean isSuspended) throws UserException {
        if (c != null) {
            try {
                Query q = em.createQuery("update Customer set isSuspended=:b where username=:u or email=:e");
                q.setParameter("b", isSuspended);
                q.setParameter("u", c.getUsername());
                q.setParameter("e", c.getEmail());
                q.executeUpdate();
            } catch (Exception e) {
                throw new UserException(e.getMessage());
            }
        }
    }
}

// buscar por Id en todas las tablas y devuelve lo que encuentra; List 1 .. N me di cuenta q esto es al pedo
//    @Transactional
//    public List<UserDTO> searchUserId(String key) throws Exception {
//        List<UserDTO> ret = new ArrayList<>();
//        try {
//            Customer c = em.find(Customer.class, Long.valueOf(key));
//            ret.add(c.getDt());
//        } catch (Exception ignored) { }
//        try {
//            Seller v = em.find(Seller.class, Long.valueOf(key));
//            ret.add(v.getDt());
//        } catch (Exception ignored) { }
//        try {
//            Administrator a = em.find(Administrator.class, Long.valueOf(key));
//            ret.add(a.getDt());
//        } catch (Exception ignored) { }
//
//        if (ret.size() == 0)
//            throw new UserException("Usuario no encontrado");
//        return ret;
//    }
//
//    @Transactional(rollbackFor = {Throwable.class})
//    public List<UserDTO> searchUser(String atr) {
//        List<UserDTO> ret = new ArrayList<>();
//        Query q;
//        try {
//            q = em.createQuery("select c from Customer c where c.email=:u or c.username=:u");
//            q.setParameter("u", atr);
//            Customer a = (Customer) q.getSingleResult();
//            em.refresh(a);
//            if (a != null)
//                ret.add(a.getDt());
//        } catch (Exception e) { }
//        try {
//            q = em.createQuery("select v from Seller v where v.email=:u or v.username=:u");
//            q.setParameter("u", atr);
//            Seller v = (Seller) q.getSingleResult();
//            em.refresh(v);
//            if (v != null)
//                ret.add(v.getDt());
//        } catch (Exception e) { }
//        try {
//            q = em.createQuery("select v from Administrator v where v.email=:u");
//            q.setParameter("u", atr);
//            Administrator ad = (Administrator) q.getSingleResult();
//            em.refresh(ad);
//            if (ad != null)
//                ret.add(ad.getDt());
//        } catch (Exception e) { }
//
//        if (ret.size() == 0)
//            return null;
//
//        return ret;
//    }
//
//    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRES_NEW, rollbackFor = {Throwable.class})
//    public void editCustomer(CustomerDTO c) throws UserException {
//        if (c != null) {
//            log.warn(c.toString());
//            try {
//                Query q = em.createQuery("update Customer set email=:c, rating=:r, blocked=:b where idUser=:u");
//                q.setParameter("u", Long.valueOf(c.getIdUser()));
//                q.setParameter("c", c.getEmail());
//                q.setParameter("b", c.isBlocked());
//                q.setParameter("r", c.getRating());
//                q.executeUpdate();
//            } catch (Exception e) {
//                e.printStackTrace();
//                throw new UserException(e.getMessage());
//            }
//        }
//    }

//
//    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRES_NEW, rollbackFor = {Throwable.class})
//    public void editSeller(SellerDTO v) throws UserException {
//        if (v != null) {
//            try {
//                Query q = em.createQuery("update Seller set email=:c, rating=:r, blocked=:b, personalId=:pid, barcode=:bc, name=:n, surname=:a where idUser=:u");
//                q.setParameter("u", Long.valueOf(v.getIdUser()));
//                q.setParameter("c", v.getEmail());
//                q.setParameter("b", v.isBlocked());
//                q.setParameter("r", v.getRating());
//                q.setParameter("n", v.getName());
//                q.setParameter("a", v.getSurname());
//                q.setParameter("bc", v.getBarcode());
//                q.setParameter("pid", v.getPersonalId());
//                q.executeUpdate();
//            } catch (Exception e) {
//                throw new UserException(e.getMessage());
//            }
//        }
//    }
//
//    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRES_NEW, rollbackFor = {Throwable.class})
//    public void editAdmin(AdminDTO c) throws UserException {
//        if (c != null) {
//            try {
//                Query q = em.createQuery("update Administrator set email=:c where idUser=:u");
//                q.setParameter("u", Long.valueOf(c.getIdUser()));
//                q.setParameter("c", c.getEmail());
//                q.executeUpdate();
//            } catch (Exception e) {
//                throw new UserException(e.getMessage());
//            }
//        }
//    }
//
//    @Transactional(rollbackFor = {Throwable.class})
//    public void deleteCustomer(String key) throws Exception {
//        if (key != null) {
//            try {
//                Query q = em.createQuery("select a from Customer a where a.email=:u or a.username=:u");
//                q.setParameter("u", key);
//                Customer a = (Customer) q.getSingleResult();
//                em.refresh(a);
//                if (a != null) {
//                    em.remove(a);
//                    em.flush();
//                }
//            } catch (Exception e) {
//                e.printStackTrace();
//                throw new UserException("Usuario no encontrado");
//            }
//        }
//    }
//
//    @Transactional
//    public void deleteSeller(String key) throws Exception {
//        if (key != null) {
//            try {
//                Query q = em.createQuery("select a from Seller a where a.email=:u or a.username=:u");
//                q.setParameter("u", key);
//                Seller a = (Seller) q.getSingleResult();
//                em.refresh(a);
//                if (a != null) {
//                    em.remove(a);
//                    em.flush();
//                }
//            } catch (Exception e2) {
//                    throw new UserException("Usuario no encontrado");
//            }
//        }
//    }
//    @Transactional
//    public void deleteAdmin(String email) throws Exception {
//        if (email != null) {
//            try {
//                Query q = em.createQuery("select a from Administrator a where a.email=:u");
//                q.setParameter("u", email);
//                Administrator a = (Administrator) q.getSingleResult();
//                em.refresh(a);
//                if (a != null) {
//                    em.remove(a);
//                    em.flush();
//                }
//            } catch (Exception e3) {
//                throw new UserException("Usuario no encontrado");
//            }
//        }
//    }
