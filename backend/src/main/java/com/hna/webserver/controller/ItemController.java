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
        return ResponseEntity.ok(new ItemResponse(item));
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

    //mapping for search items
    @GetMapping("/search")
    public ResponseEntity<List<ItemResponse>> search(@RequestParam String query, String size, String type, String color, Integer minPrice, Integer maxPrice) {
        List<Item> items = itemService.search(query, size, minPrice, maxPrice, color, type);
        List<ItemResponse> resp = items.stream().map(ItemResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }
}
