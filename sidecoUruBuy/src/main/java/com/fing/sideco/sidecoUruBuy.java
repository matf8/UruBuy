package com.fing.sideco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@ComponentScan(basePackages = "com.fing.sideco.*")
@EnableJpaRepositories(basePackages =  "com.fing.sideco.dao")
public class sidecoUruBuy {

    public static void main(String[] args) {
        SpringApplication.run(sidecoUruBuy.class, args);
        System.out.println("¡Hola SIDECO UruBuy!");
    }
}
