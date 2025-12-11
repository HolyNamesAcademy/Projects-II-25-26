package com.hna.webserver.service;

import com.hna.webserver.model.User;
import com.hna.webserver.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Creates a new user.
     *
     * @param name the name
     * @param password the plain text password (will be hashed)
     * @param email the email address
     * @return the created user
     * @throws IllegalArgumentException if name or email already exists
     */
    public User createUser(String name, String password, String email) {
        if (userRepository.existsByName(name)) {
            throw new IllegalArgumentException("Name already exists: " + name);
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        User user = new User();
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);

        User saved = userRepository.save(user);
        logger.info("Created user: {}", name);
        return saved;
    }

    /**
     * Updates user's last login timestamp.
     */
    public void updateLastLogin(String name) {
        userRepository.findByName(name).ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    /**
     * Finds a user by name.
     */
    @Transactional(readOnly = true)
    public Optional<User> findByName(String name) {
        return userRepository.findByName(name);
    }
}