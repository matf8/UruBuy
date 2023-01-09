package com.fing.backend.rest;

import com.fing.backend.business.interfaces.INotificationService;
import com.fing.backend.dao.mongo.ITenantRepositoryNsql;
import com.fing.backend.dto.RecipientsDTO;
import com.fing.backend.entity.TenantInfo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.mongodb.client.result.UpdateResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Objects;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(value = "*")
@Slf4j
public class NotificationRest {

    @Autowired private ITenantRepositoryNsql iTenantRepository;
    @Autowired private MongoTemplate mongoTemplate;
    @Autowired private INotificationService notificationService;

    private boolean manageAdd(TenantInfo tenant) {
        TenantInfo tenantInfo = iTenantRepository.findById(tenant.getIdTenant()).orElse(null);
        if (Objects.isNull(tenantInfo))
            return true;    // no existe lo persisto
        else {
            if (!tenantInfo.getToken().equals(tenant.getToken())) {
                Query query = new Query(Criteria.where("idTenant").is(tenant.getIdTenant()));
                Update update = new Update();
                update.set("token", tenant.getToken());                  // update client token
                update.set("timestamp", tenant.getTimestamp());
                UpdateResult result = mongoTemplate.updateFirst(query, update, TenantInfo.class);
                if (result.getModifiedCount() == 0)
                    log.warn("No documents updated");
                else System.out.println(result.getModifiedCount() + " document(s) updated..");
                return false;
            } else return true;
        }
    }

    // expo
    @PostMapping("/addXP")
    public ResponseEntity<Object> addTokenXP(@RequestBody TenantInfo tenantInfo) throws Exception {
        if (tenantInfo == null)
            return new ResponseEntity<>("datos requerido", HttpStatus.PRECONDITION_REQUIRED);
        else {
            try {
                if (manageAdd(tenantInfo))
                    iTenantRepository.save(tenantInfo);
                return new ResponseEntity<>(HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(e, HttpStatus.NOT_FOUND);
            }
        }
    }

    @PostMapping ("/sendDeals")
    public ResponseEntity<Object> sendDeals(@RequestBody RecipientsDTO recipients) {
        if (!recipients.getRecipients().isEmpty()) {
            try {
                notificationService.sendDeals(recipients.getRecipients());
                return new ResponseEntity<>(HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
    }

    @PostMapping ("/sendNews")
    public ResponseEntity<Object> sendNews(@RequestBody RecipientsDTO recipients) {   // lista de emails
        if (!recipients.getRecipients().isEmpty()) {
            try {
                notificationService.sendNews(recipients.getRecipients());
                return new ResponseEntity<>(HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
    }

    @PutMapping("/setting/{user}")
    public ResponseEntity<Object> settingNotifications(@PathVariable("user") String user) {
        try {
            if (Objects.nonNull(user) && !user.equals("")) {
                return new ResponseEntity<>(notificationService.settingNotifications(user), HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

/*
 // firebase useless functions
    @PostMapping("/addFS")
    public ResponseEntity<Object> addTokenFirebase(@RequestBody TenantInfo tenantInfo) throws Exception {
        if (Objects.isNull(tenantInfo))
            return new ResponseEntity<>("Datos requerido.", HttpStatus.PRECONDITION_REQUIRED);
        else {
            try {
                if (manageAdd(tenantInfo))   // se fija si ya existe el token; si devuelve true lo persiste, si devuelve false significa que lo actualizó porqe ya existia un token para ese tenant
                    // guarda en mongo el con Id device o Id Usuario
                    iTenantRepository.save(tenantInfo);
                return new ResponseEntity<>(HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(e, HttpStatus.NOT_FOUND);
            }
        }
    }

@GetMapping("/testNtfFS")
    public ResponseEntity<Object> sendNotification() {
        try {
            notificationService.sendNotification();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.info(e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
 */
