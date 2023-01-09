package com.fing.backend.business.interfaces;

import com.fing.backend.dto.PurchaseDTO;

import java.util.List;

public interface INotificationService {

    void sendStatusChanged(String email, PurchaseDTO p) throws Exception;
    void sendNews(List<String> recipients) throws Exception;
    void sendDeals(List<String> recipients) throws Exception;
    Boolean settingNotifications(String email) throws Exception;

}

  /*
     void suscribeTenants(); // todos
    void unsuscribeTenants();
    void suscribeTokenFS(String token, String topic);   // de a 1
    void unsuscribeTokenFS(String token, String topic);
    void sendNotification(); // test op
     */
