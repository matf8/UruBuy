package com.fing.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.InputStream;
import java.util.Objects;
import javax.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FirebaseServer {

    @PostConstruct
    private void initFirebase() {
        try {
            InputStream firebaseSecret = getClass().getClassLoader().getResourceAsStream("urubuy-firebase.json");
            FirebaseOptions.Builder builder = FirebaseOptions.builder();
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(Objects.requireNonNull(firebaseSecret)))
                    .build();

            FirebaseApp.initializeApp(options);
            log.info("Firebase initialized");
          //  FirestoreClient.getFirestore();       // no vamos a persistir notificaciones como inicialmente pensé
        } catch (Exception e) {
            log.error("Firebase server error: ", e.getMessage());
        }
    }
}

