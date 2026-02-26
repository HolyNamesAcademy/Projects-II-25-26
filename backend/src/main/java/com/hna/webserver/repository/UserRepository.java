package com.hna.webserver.repository;

import com.hna.webserver.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByName(String name);

    @EntityGraph(attributePaths = "favorites")
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "favorites")
    Optional<User> findById(Long id);

    boolean existsByName(String name);
    
    boolean existsByEmail(String email);
}