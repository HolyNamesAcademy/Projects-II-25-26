package com.hna.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public final class WebserverApplication {

    private WebserverApplication() {
        // Private constructor to prevent instantiation
    }

    public static void main(String[] args) {
        SpringApplication.run(WebserverApplication.class, args);
    }
}
