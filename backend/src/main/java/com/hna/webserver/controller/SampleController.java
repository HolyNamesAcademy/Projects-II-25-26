package com.hna.webserver.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SampleController {

    @GetMapping("/hello")
    public Map<String, Object> getHello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello from HNA Web Server!");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "success");
        return response;
    }

    @GetMapping("/users")
    public Map<String, Object> getUsers() {
        Map<String, Object> response = new HashMap<>();

        // Sample user data
        Map<String, Object> user1 = new HashMap<>();
        user1.put("id", 1);
        user1.put("name", "John Doe");
        user1.put("email", "john.doe@example.com");
        user1.put("password", "password123");

        Map<String, Object> user2 = new HashMap<>();
        user2.put("id", 2);
        user2.put("name", "Jane Smith");
        user2.put("email", "jane.smith@example.com");
        user2.put("password", "securepass");

        response.put("users", new Object[]{user1, user2});
        response.put("total", 2);
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "success");

        return response;
    }

    @GetMapping("/health")
    public Map<String, Object> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "HNA Web Server");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
}
