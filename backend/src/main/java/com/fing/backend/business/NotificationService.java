package com.fing.backend.business;

import com.fing.backend.business.interfaces.INotificationService;
import com.fing.backend.dao.UserRepository;
import com.fing.backend.dao.mongo.ITenantRepositoryNsql;
import com.fing.backend.dto.PurchaseDTO;
import com.fing.backend.entity.Customer;
import com.fing.backend.entity.TenantInfo;

import com.fing.backend.exception.UserException;
import io.github.jav.exposerversdk.ExpoPushMessage;
import io.github.jav.exposerversdk.ExpoPushTicket;
import io.github.jav.exposerversdk.PushClient;
import io.github.jav.exposerversdk.PushClientException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

@Controller
@Slf4j
public class NotificationService implements INotificationService {

    @Autowired private ITenantRepositoryNsql iTenantRepository;
    @Autowired private UserRepository userRepository;
    private Boolean userNotificationsEnabled;

    public void sendStatusChanged(String email, PurchaseDTO p) throws Exception {
        try {
            TenantInfo t = iTenantRepository.findById(email).orElse(null);
            if (Objects.nonNull(t)) {
                Customer c = userRepository.findCustomerByEmailOrUsername(email);
                this.userNotificationsEnabled = c.getNotificationsEnabled();
                if (this.userNotificationsEnabled) {
                    if (!c.getIsBlocked()) {
                        if (!c.getIsSuspended()) {
                            String recipient = t.getToken(); // ExpoToken generado en mobile
                            String title = "UruBuy";
                            String message = "Tu compra " + p.getShoppingPosts().get(0).getTitle() + " cambió de estado: " + handleStatus(p.getStatus());
                            Map<String, Object> data = new HashMap<>(); // set category to make different notifications
                            data.put("category", "estado");
                            data.put("purchaseId", p.getId());
                            if (!PushClient.isExponentPushToken(recipient))
                                throw new Error("Token:" + recipient + " is not a valid token.");

                            ExpoPushMessage expoPushMessage = new ExpoPushMessage();
                            expoPushMessage.getTo().add(recipient);
                            expoPushMessage.setTitle(title);
                            expoPushMessage.setBody(message);
                            expoPushMessage.setData(data);

                            List<ExpoPushMessage> expoPushMessages = new ArrayList<>();
                            expoPushMessages.add(expoPushMessage);

                            PushClient client = null;
                            try {
                                client = new PushClient();
                            } catch (PushClientException e) {
                                throw new RuntimeException(e);
                            }
                            List<List<ExpoPushMessage>> chunks = client.chunkPushNotifications(expoPushMessages);

                            List<CompletableFuture<List<ExpoPushTicket>>> messageRepliesFutures = new ArrayList<>();

                            for (List<ExpoPushMessage> chunk : chunks) {
                                messageRepliesFutures.add(client.sendPushNotificationsAsync(chunk));
                            }

                            // Wait for each completable future to finish
                            List<ExpoPushTicket> allTickets = new ArrayList<>();
                            for (CompletableFuture<List<ExpoPushTicket>> messageReplyFuture : messageRepliesFutures) {
                                try {
                                    allTickets.addAll(messageReplyFuture.get());
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                        } else throw new UserException("Usuario suspendido: " + email);
                    } else throw new UserException("Usuario bloqueado: " + email);
                } else throw new UserException("Notificaciones desactivadas, user: " + email);
            } else throw new UserException("Tenant no encontrado: " + email);
        } catch (Exception e) {
            throw e;
        }
    }

    public void sendNews(List<String> recipients) throws Exception {
        try {
            recipients.forEach(r -> {
                TenantInfo t = iTenantRepository.findById(r).orElse(null);
                if (Objects.nonNull(t)) {
                    Customer c = null;
                    try {
                        c = userRepository.findCustomerByEmailOrUsername(t.getIdTenant());
                    } catch (UserException e) {
                        log.info(e.getMessage());
                    }
                    this.userNotificationsEnabled = c.getNotificationsEnabled();
                    if (this.userNotificationsEnabled) {
                        if (!c.getIsBlocked()) {
                            if (!c.getIsSuspended()) {
                                String recipient = t.getToken(); // ExpoToken generado en mobile
                                String title = "UruBuy";
                                String message = "¡Estos nuevos productos te van a encantar!";
                                Map<String, Object> data = new HashMap<>(); // set category to make different notifications
                                data.put("category", "nuevos");

                                if (!PushClient.isExponentPushToken(recipient))
                                    throw new Error("Token:" + recipient + " is not a valid token.");

                                ExpoPushMessage expoPushMessage = new ExpoPushMessage();
                                expoPushMessage.getTo().add(recipient);
                                expoPushMessage.setTitle(title);
                                expoPushMessage.setBody(message);
                                expoPushMessage.setData(data);

                                List<ExpoPushMessage> expoPushMessages = new ArrayList<>();
                                expoPushMessages.add(expoPushMessage);

                                PushClient client = null;
                                try {
                                    client = new PushClient();
                                } catch (PushClientException e) {
                                    throw new RuntimeException(e);
                                }
                                List<List<ExpoPushMessage>> chunks = client.chunkPushNotifications(expoPushMessages);

                                List<CompletableFuture<List<ExpoPushTicket>>> messageRepliesFutures = new ArrayList<>();

                                for (List<ExpoPushMessage> chunk : chunks) {
                                    messageRepliesFutures.add(client.sendPushNotificationsAsync(chunk));
                                }

                                // Wait for each completable future to finish
                                List<ExpoPushTicket> allTickets = new ArrayList<>();
                                for (CompletableFuture<List<ExpoPushTicket>> messageReplyFuture : messageRepliesFutures) {
                                    try {
                                        allTickets.addAll(messageReplyFuture.get());
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            } else throw new RuntimeException("Usuario suspendido: " + r);
                        } else throw new RuntimeException("Usuario bloqueado: " + r);
                    } else throw new RuntimeException("Notificaciones desactivadas, user: " + r);
                } else throw new RuntimeException("Tenant no encontrado: " + r);
            });
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    public void sendDeals(List<String> recipients) throws Exception {
        try {
            recipients.forEach(r -> {
                TenantInfo t = iTenantRepository.findById(r).orElse(null);
                if (Objects.nonNull(t)) {
                    Customer c = null;
                    try {
                        c = userRepository.findCustomerByEmailOrUsername(t.getIdTenant());
                    } catch (UserException e) {
                        log.info(e.getMessage());
                    }
                    this.userNotificationsEnabled = c.getNotificationsEnabled();
                    if (this.userNotificationsEnabled) {
                        if (!c.getIsBlocked()) {
                            if (!c.getIsSuspended()) {
                                String recipient = t.getToken(); // ExpoToken generado en mobile
                                String title = "UruBuy";
                                String message = "Ven a ver las últimas ofertas para Navidad \uD83C\uDF85 \uD83C\uDF84";
                                Map<String, Object> data = new HashMap<>(); // set category to make different notifications
                                data.put("category", "promociones");

                                if (!PushClient.isExponentPushToken(recipient))
                                    throw new Error("Token:" + recipient + " is not a valid token.");

                                ExpoPushMessage expoPushMessage = new ExpoPushMessage();
                                expoPushMessage.getTo().add(recipient);
                                expoPushMessage.setTitle(title);
                                expoPushMessage.setBody(message);
                                expoPushMessage.setData(data);

                                List<ExpoPushMessage> expoPushMessages = new ArrayList<>();
                                expoPushMessages.add(expoPushMessage);

                                PushClient client = null;
                                try {
                                    client = new PushClient();
                                } catch (PushClientException e) {
                                    throw new RuntimeException(e);
                                }
                                List<List<ExpoPushMessage>> chunks = client.chunkPushNotifications(expoPushMessages);

                                List<CompletableFuture<List<ExpoPushTicket>>> messageRepliesFutures = new ArrayList<>();

                                for (List<ExpoPushMessage> chunk : chunks) {
                                    messageRepliesFutures.add(client.sendPushNotificationsAsync(chunk));
                                }

                                // Wait for each completable future to finish
                                List<ExpoPushTicket> allTickets = new ArrayList<>();
                                for (CompletableFuture<List<ExpoPushTicket>> messageReplyFuture : messageRepliesFutures) {
                                    try {
                                        allTickets.addAll(messageReplyFuture.get());
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            } else throw new RuntimeException("Usuario suspendido: " + r);
                        } else throw new RuntimeException("Usuario bloqueado: " + r);
                    } else throw new RuntimeException("Notificaciones desactivadas, user: " + r);
                } else throw new RuntimeException("Tenant no encontrado: " + r);
            });
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    public Boolean settingNotifications(String user) throws Exception {
       return userRepository.settingNotifications(user);
    }

    private String handleStatus(String status) {
        String s = "";
        if (status.equals("PREPARING_ORDER"))
            s = "En preparación";
        else if (status.equals("OUT_FOR_DELIVERY"))
            s = "En camino";
        else if (status.equals("READY_FOR_PICKUP"))
            s = "Listo para retirar";
        else if (status.equals("DELIVERED"))
            s = "Entregado";
        else s = "Indefinido";
        return s;
    }
}

/*

    // firebase no se utilizo
    // ejemplo de notificacion personalizada
    public void notificarCreacionUser(Usuario u, String token) {
        try {
            if (u != null) {
                Firestore db = FirestoreClient.getFirestore();
                // send notificacion a server
                Notificacion dt = new Notificacion();
                dt.setUser(u.getNombreUsuario());
                dt.setCorreo(u.getCorreo());
                dt.setEdad(calcEdad(u.getBirthdate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(), LocalDate.now()));
                dt.setDescripcion("Usuario creado: " + dt.getUser() + "\n" + "Edad: " + dt.getEdad());
                db.collection("urubuyFS.creaciones").add(dt).get();
                if (true) {
                    //String topic = "CreacionUsuario";
                    Notification notfy = Notification.builder().setTitle("UruBuy")
                            .setBody(dt.getDescripcion()).build();
                    Message message = Message.builder().setNotification(notfy)
                            .putData("Edad", String.valueOf(dt.getEdad()))
                            .putData("Nombre", dt.getUser()).build();
                    //  .setTopic(topic)
                    //.setToken(token).build();
                    FirebaseMessaging.getInstance().send(message);
                    log.info("Firebase notification: " + dt.getUser() + " creado con edad: " + dt.getEdad());
                }

            } else log.error("que paso");
        } catch (Exception e) {
            log.error("Firebase error: " + e.getMessage());
        }
    }

    // suscribo los tokens en mongo a un topic, para mandarle push noticias, promociones o cosas
    public void suscribeTenants() { // to topics
        List<TenantInfo> tenants = iTenantRepository.findAll();
        List<String> registrationTokens = new ArrayList<String>();
        for (TenantInfo s : tenants)
            registrationTokens.add(s.getToken());
        try {
            TopicManagementResponse response = FirebaseMessaging.getInstance().subscribeToTopic(
                    registrationTokens, "promociones");
            log.info(response.getSuccessCount() + " tokens were subscribed successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // suscribir un cliente de un topic
    public void suscribeTokenFS(String token, String topic) {       // from topics
        try {
            TopicManagementResponse response = FirebaseMessaging.getInstance().subscribeToTopic(
                    Arrays.asList(token), topic);
            log.info(response.getSuccessCount() + " tokens were subscribed successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // la doc de google dice que hasta 1000 tokens se pueden suscribir. Pa no llegar a 1000 y como no se si los token que ya suscribió los vuelve a suscribir o los repite
    // tambien sirve para que el usuario configure sus subscripciones y elija que quiere, van a ver varios suscribe y unsuscribe topic
    public void unsuscribeTenants() {       // from topics; a todos los de la bd
        List<TenantInfo> tenants = iTenantRepository.findAll();
        List<String> registrationTokens = new ArrayList<String>();
        for (TenantInfo s : tenants)
            registrationTokens.add(s.getToken());
        try {
            TopicManagementResponse response = FirebaseMessaging.getInstance().unsubscribeFromTopic(
                    registrationTokens, "promociones");
            log.info(response.getSuccessCount() + " tokens were unsubscribed successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // desuscribir un cliente de un topic
    public void unsuscribeTokenFS(String token, String topic) {       // from topics
        try {
            TopicManagementResponse response = FirebaseMessaging.getInstance().unsubscribeFromTopic(
                    Arrays.asList(token), topic);
            log.info(response.getSuccessCount() + " tokens were unsubscribed successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // test push notify firebase
    public void sendNotification() {
        try {
            Notification notification = Notification.builder().setTitle("UruBuy")
                    .setBody("Promociones").build();
            Message message = Message.builder().setNotification(notification)
                    .putData("Championes", "Nike AirMax")
                    .putData("Descuento", "50%")
                    .setTopic("promociones").build();

            FirebaseMessaging.getInstance().send(message);
            log.info("Firebase notification a promociones");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
 */