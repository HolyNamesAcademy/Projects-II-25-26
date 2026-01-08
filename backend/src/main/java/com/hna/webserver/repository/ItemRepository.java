package com.hna.webserver.repository;

import com.hna.webserver.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    Optional<Item> findByID(Long id);

    boolean existsByID(Long id);
}