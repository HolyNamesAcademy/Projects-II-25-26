package com.hna.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public final class WebserverApplication {

    private WebserverApplication() {
        // Private constructor to prevent instantiation
    }

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(WebserverApplication.class);
        if (Boolean.parseBoolean(System.getProperty("app.seed.cli", "false"))) {
            app.setWebApplicationType(WebApplicationType.NONE);
        }
        app.run(args);
    }
}
