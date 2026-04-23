package com.hna.webserver.controller;

import com.hna.webserver.dto.ItemRequest;
import com.hna.webserver.dto.ItemResponse;
import com.hna.webserver.model.Color;
import com.hna.webserver.model.Item;
import com.hna.webserver.model.Size;
import com.hna.webserver.model.Type;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private static final Logger log = LoggerFactory.getLogger(ImageController.class);

    private final ItemService itemService;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/images/";

    public ImageController(ItemService itemService, UserRepository userRepository) {
        this.itemService = itemService;
        this.userRepository = userRepository;
        // Create upload directory if it doesn't exist
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            log.error("Failed to create upload directory", e);
        }
    }

    @PostMapping("/upload/{itemId}")
    public ResponseEntity<String> uploadImage(@PathVariable Long itemId, @RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the item belongs to the user
        Item item = itemService.getItemById(itemId);
        if (!item.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can only upload images for your own items");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only image files are allowed");
        }

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update item's image field
            String imageUrl = "/api/images/" + filename;
            item.setImage(imageUrl);
            itemService.saveItem(item);

            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            log.error("Failed to save image", e);
            return ResponseEntity.status(500).body("Failed to save image");
        }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .body(imageBytes);
        } catch (IOException e) {
            log.error("Failed to read image", e);
            return ResponseEntity.status(500).build();
        }
    }
}
