package com.hna.webserver.dto;

import java.util.HashSet;
import java.util.Set;

public class AuthResponse {

    private String token;
    private String name;
    private String email;
    private Set<String> roles;

    public AuthResponse() {
    }

    public AuthResponse(String token, String name, String email, Set<String> roles) {
        this.token = token;
        this.name = name;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}