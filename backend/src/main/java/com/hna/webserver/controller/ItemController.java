package com.hna.webserver.controller;

import com.hna.webserver.dto.ItemRequest;
import com.hna.webserver.dto.ItemResponse;
import com.hna.webserver.model.Item;
import com.hna.webserver.model.User;
import com.hna.webserver.repository.UserRepository;
import com.hna.webserver.service.ItemService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private static final Logger log = LoggerFactory.getLogger(ItemController.class);

    private final ItemService itemService;
    private final UserRepository userRepository;

    public ItemController(ItemService itemService, UserRepository userRepository) {
        this.itemService = itemService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody ItemRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        System.out.println("Authenticated user email: " + email);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Item created = itemService.createItem(req, user);
        return ResponseEntity.ok(new ItemResponse(created));
    }

    @GetMapping
    public ResponseEntity<List<ItemResponse>> listItems() {
        List<Item> items = itemService.getAllItems();
        List<ItemResponse> resp = items.stream().map(ItemResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItem(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        ItemResponse resp = new ItemResponse(item);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            try {
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null && user.getFavorites() != null) {
                    resp.setFavorited(user.getFavorites().stream().anyMatch(i -> i.getId().equals(item.getId())));
                }
            } catch (Exception e) {
                log.warn("Error checking if item is favorited for user {}: {}", email, e.getMessage());
            }
        }
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> updateItem(@PathVariable Long id, @Valid @RequestBody ItemRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Item updated = itemService.updateItem(id, req, user);
        return ResponseEntity.ok(new ItemResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        itemService.deleteItem(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> favoriteItem(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        itemService.favoriteItem(id, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<Void> unfavoriteItem(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        itemService.unfavoriteItem(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<ItemResponse>> listFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<Item> items = itemService.getFavoritesForUser(user);
        List<ItemResponse> resp = items.stream().map(item -> {
            ItemResponse r = new ItemResponse(item);
            r.setFavorited(true);
            return r;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }

    //mapping for search items
    @GetMapping("/search")
    public ResponseEntity<List<ItemResponse>> search(@RequestParam String query, String size, String type, String color, Integer minPrice, Integer maxPrice) {
        List<Item> items = itemService.search(query, size, minPrice, maxPrice, color, type);
        List<ItemResponse> resp = items.stream().map(ItemResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }
}
