package com.fing.sideco.business.interfaces;

import com.fing.sideco.entity.NewIdCard;
import com.fing.sideco.entity.OldIdCard;
import com.fing.sideco.exception.SidecoException;

import java.util.List;

public interface IIdCardService {

    void addOldIdCard(OldIdCard u) throws Exception;
    OldIdCard getOldIdCards(String personalId, String serie, Integer barCode) throws Exception;
    List<OldIdCard> getOldIdCards() throws SidecoException;
    void editOldIdCard(OldIdCard u);
    void deleteOldIdCard(String personalId);
    void addNewIdCard(NewIdCard i) throws Exception;
    NewIdCard getNewIdCard(String personalId, String secureCode)throws Exception;
    List<NewIdCard> getNewIdCards() throws SidecoException;
}