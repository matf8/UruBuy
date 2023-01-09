package com.fing.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@ComponentScan(basePackages = "com.fing.backend.*")
@EnableJpaRepositories(basePackages =  "com.fing.backend.*")
public class UruBuy {
    public static void main(String[] args) {
        SpringApplication.run(UruBuy.class, args);
        System.out.println("Hola UruBuy!");
    }
}
