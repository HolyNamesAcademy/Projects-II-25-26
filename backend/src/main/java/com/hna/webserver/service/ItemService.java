package com.hna.webserver.service;

import com.hna.webserver.dto.ItemRequest;
import com.hna.webserver.model.Item;
import com.hna.webserver.model.User;
import com.hna.webserver.repository.ItemRepository;
import com.hna.webserver.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemService(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public void favoriteItem(Long itemId, User user) {
        Item item = getItemById(itemId);
        // Fetch user with favorites eagerly loaded to avoid LazyInitializationException
        User userWithFavorites = userRepository.findById(user.getId())
                .orElse(user);
        if (userWithFavorites.getFavorites() == null) {
            userWithFavorites.setFavorites(new java.util.HashSet<>());
        }
        if (userWithFavorites.getFavorites().add(item)) {
            userRepository.save(userWithFavorites);
            logger.info("User {} favorited item {}", userWithFavorites.getId(), itemId);
        }
    }

    public void unfavoriteItem(Long itemId, User user) {
        Item item = getItemById(itemId);
        // Fetch user with favorites eagerly loaded to avoid LazyInitializationException
        User userWithFavorites = userRepository.findById(user.getId())
                .orElse(user);
        if (userWithFavorites.getFavorites() != null && userWithFavorites.getFavorites().remove(item)) {
            userRepository.save(userWithFavorites);
            logger.info("User {} unfavorited item {}", userWithFavorites.getId(), itemId);
        }
    }

    public java.util.List<Item> getFavoritesForUser(User user) {
        User fresh = userRepository.findById(user.getId()).orElse(user);
        if (fresh.getFavorites() == null) return java.util.Collections.emptyList();
        
        // Eagerly initialize the favoritedBy collection for each item while in transaction
        java.util.List<Item> favorites = new java.util.ArrayList<>(fresh.getFavorites());
        for (Item item : favorites) {
            // Access the collection to ensure it's initialized within the transaction
            if (item.getFavoritedBy() != null) {
                // Explicitly calling size() to force Hibernate lazy loading - return value intentionally ignored
                @SuppressWarnings("unused")
                int size = item.getFavoritedBy().size();
            }
        }
        return favorites;
    }

    public Item createItem(ItemRequest req, User user) {
        Item item = new Item();
        item.setName(req.getName());
        item.setPrice(req.getPrice());
        item.setSize(req.getSize());
        item.setType(req.getType());
        item.setColor(req.getColor());
        item.setImage(req.getImage());
        item.setDescription(req.getDescription());
        item.setUser(user);

        Item saved = itemRepository.save(item);
        logger.info("Created item id={}", saved.getId());
        return saved;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public Item updateItem(Long id, ItemRequest req, User user) {
        Item existing = getItemById(id);
        if (existing.getUser() == null || !existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Forbidden");
        }
        existing.setName(req.getName());
        existing.setPrice(req.getPrice());
        existing.setSize(req.getSize());
        existing.setType(req.getType());
        existing.setColor(req.getColor());
        existing.setImage(req.getImage());
        existing.setDescription(req.getDescription());

        Item saved = itemRepository.save(existing);
        logger.info("Updated item id={}", id);
        return saved;
    }

    public void deleteItem(Long id, User user) {
        Item existing = getItemById(id);
        if (existing.getUser() == null || !existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Forbidden");
        }
        itemRepository.delete(existing);
        logger.info("Deleted item id={}", id);
    }

    //search items
    //apply filters
    public List<Item> search(String query, String size, Integer minPrice, Integer maxPrice, String color, String type) {
        List<Item> filteredItems = itemRepository.findAll().stream()
                .filter(item -> item.getName().toLowerCase().contains(query.toLowerCase()) ||
                        item.getDescription().toLowerCase().contains(query.toLowerCase()))
                .filter(item -> size == null || item.getSize().equalsIgnoreCase(size))
                .filter(item -> minPrice == null || item.getPrice() >= minPrice)
                .filter(item -> maxPrice == null || item.getPrice() <= maxPrice)
                .filter(item -> color == null || item.getColor().equalsIgnoreCase(color))
                .filter(item -> type == null || item.getType().equalsIgnoreCase(type))
                .toList();
        return filteredItems;
    }
}
