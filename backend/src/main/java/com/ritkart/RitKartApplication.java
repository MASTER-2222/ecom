package com.ritkart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class RitKartApplication {

    public static void main(String[] args) {
        SpringApplication.run(RitKartApplication.class, args);
    }
}