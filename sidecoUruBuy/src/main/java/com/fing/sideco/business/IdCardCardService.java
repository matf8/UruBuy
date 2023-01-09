package com.fing.sideco.business;

import com.fing.sideco.business.interfaces.IIdCardService;
import com.fing.sideco.dao.IOldIdCardRepository;
import com.fing.sideco.dao.INewIdCardRepository;
import com.fing.sideco.entity.OldIdCard;
import com.fing.sideco.entity.NewIdCard;
import com.fing.sideco.exception.SidecoException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class IdCardCardService implements IIdCardService {

    @Autowired private IOldIdCardRepository iOldIdCardRepository;
    @Autowired private INewIdCardRepository iNewIdCardRepository;
    @Autowired EntityManager em;                                // iria en el dao pero como hay solo una interfaz, da igual ?

    public void addOldIdCard(OldIdCard i) throws Exception {
        if (Objects.nonNull(i.getPersonalId()) && Objects.nonNull(i.getFileNumber()))
            try {
                iOldIdCardRepository.save(i);
            } catch (Exception e) {
                throw e;
            }
        else throw new SidecoException("No se admiten valores vacíos");
    }

    @Transactional
    public OldIdCard getOldIdCards(String personalId, String serie, Integer folNumber) throws Exception {
        try {
            Query q = em.createQuery("select i from OldIdCard i where i.personalId=:pid");
            q.setParameter("pid", personalId);
            OldIdCard ico = (OldIdCard) q.getSingleResult();
            if (Objects.nonNull(ico)) {
                if (folNumber.equals(ico.getFileNumber()) && serie.equals(ico.getSeriesLetter()))
                    return ico;
                else {
                    throw new SidecoException("Folio o serie no coinciden con los registros");
                }
            } else return null;
        } catch (Exception e) {
            throw new SidecoException("Usuario no registrado en SIDECO");
        }
    }

    public List<OldIdCard> getOldIdCards() throws SidecoException {
        try {
            List<OldIdCard> idCards = new ArrayList<>();
            iOldIdCardRepository.findAll().forEach(u -> idCards.add(u));
            return idCards;
        } catch (Exception e) {
            throw new SidecoException("\nError con la lista: " + e.getMessage());
        }
    }


    public void editOldIdCard(OldIdCard u) {
        try {
            OldIdCard usr = iOldIdCardRepository.findById(u.getId()).orElse(null);
            if (Objects.nonNull(usr))
                iOldIdCardRepository.save(u);
        } catch (Exception e) {
            log.warn(e.getMessage());
        }
    }

    public void deleteOldIdCard(String personalId) {
        try {
            OldIdCard u = getPIDold(personalId);
            if (Objects.nonNull(u))
                iOldIdCardRepository.delete(u);
        } catch (Exception e) {
            log.warn(e.getMessage());
        }
    }

    @Transactional
    public OldIdCard getPIDold(String personalId){
        Query q = em.createQuery("select u from OldIdCard u where u.personalId=:pid");
        q.setParameter("pid", personalId);
        OldIdCard u = (OldIdCard) q.getSingleResult();
        if (Objects.nonNull(u))
            return u;
        else return null;

    }

    // new id card

    public void addNewIdCard(NewIdCard i) throws Exception {
        if (Objects.nonNull(i.getPersonalId()) && Objects.nonNull(i.getSecureCode()))
            try {
                iNewIdCardRepository.save(i);
            } catch (Exception e) {
                throw e;
            }
        else throw new SidecoException("No se admiten valores vacíos");
    }



    @Transactional
    public NewIdCard getNewIdCard(String personalId, String secureCode) throws Exception {
        try {
            Query q = em.createQuery("select i from NewIdCard i where i.personalId=:pid");
            q.setParameter("pid", personalId);
            NewIdCard idCard = (NewIdCard) q.getSingleResult();
            if (Objects.nonNull(idCard)) {
                if (secureCode.equals(idCard.getSecureCode()))
                    return idCard;
                else {
                    throw new SidecoException("Secure code distinto al registrado");
                }
            } else return null;
        } catch (Exception e) {
            throw new SidecoException("Usuario no registrado en SIDECO");
        }
    }

    public List<NewIdCard> getNewIdCards() throws SidecoException {
        try {
            List<NewIdCard> idCards = new ArrayList<>();
            iNewIdCardRepository.findAll().forEach(u -> idCards.add(u));
            return idCards;
        } catch (Exception e) {
            throw new SidecoException("\nError con la lista: " + e.getMessage());
        }
    }

    @Transactional
    public NewIdCard getPIDnew(String personalId){
        Query q = em.createQuery("select u from NewIdCard u where u.personalId=:pid");
        q.setParameter("pid", personalId);
        NewIdCard u = (NewIdCard) q.getSingleResult();
        if (Objects.nonNull(u))
            return u;
        else return null;

    }

}
