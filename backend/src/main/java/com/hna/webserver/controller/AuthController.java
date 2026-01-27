package com.hna.webserver.controller;

import com.hna.webserver.dto.AuthResponse;
import com.hna.webserver.dto.ErrorResponse;
import com.hna.webserver.dto.LoginRequest;
import com.hna.webserver.dto.RegisterRequest;
import com.hna.webserver.model.User;
import com.hna.webserver.repository.UserRepository;
import com.hna.webserver.security.JwtTokenProvider;
import com.hna.webserver.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserRepository userRepository,
            UserService userService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest request) {
        log.info("Register attempt for user: {} from origin: {}", registerRequest.getEmail(), request.getHeader("Origin"));
        log.debug("Request headers: User-Agent={}, Content-Type={}",
            request.getHeader("User-Agent"), request.getHeader("Content-Type"));

        try {
            User user = userService.createUser(
                    registerRequest.getName(),
                    registerRequest.getPassword(),
                    registerRequest.getEmail()
            );
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            registerRequest.getEmail(),
                            registerRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(registerRequest.getEmail());

            userService.updateLastLogin(registerRequest.getEmail());

            log.info("Register successful for user: {}", registerRequest.getEmail());
            AuthResponse response = new AuthResponse(token, user.getName(), user.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Register failed for user: {} - {}", registerRequest.getEmail(), e.getMessage());
            String errorMessage = e.getMessage();
            if (errorMessage.contains("Email already exists")) {
                errorMessage = "Email already used";
            } else if (errorMessage.contains("Name already exists")) {
                errorMessage = "Name already used";
            }
            ErrorResponse errorResponse = new ErrorResponse("REGISTRATION_FAILED", errorMessage);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Register failed for user: {} - {}", registerRequest.getEmail(), e.getMessage(), e);
            ErrorResponse errorResponse = new ErrorResponse("REGISTRATION_FAILED", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        log.info("Login attempt for user: {} from origin: {}", loginRequest.getEmail(), request.getHeader("Origin"));
        log.debug("Request headers: User-Agent={}, Content-Type={}",
            request.getHeader("User-Agent"), request.getHeader("Content-Type"));

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(loginRequest.getEmail());

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            userService.updateLastLogin(loginRequest.getEmail());

            log.info("Login successful for user: {}", loginRequest.getEmail());
            AuthResponse response = new AuthResponse(token, user.getName(), user.getEmail());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.warn("Login failed for user: {} - Bad credentials", loginRequest.getEmail());
            throw e;
        } catch (Exception e) {
            log.error("Login failed for user: {} - {}", loginRequest.getEmail(), e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponse response = new AuthResponse(null, user.getName(), user.getEmail());
        return ResponseEntity.ok(response);
    }
}
