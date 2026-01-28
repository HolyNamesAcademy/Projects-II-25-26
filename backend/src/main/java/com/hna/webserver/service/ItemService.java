package com.hna.webserver.service;

import com.hna.webserver.dto.ItemRequest;
import com.hna.webserver.model.Item;
import com.hna.webserver.model.User;
import com.hna.webserver.repository.ItemRepository;
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

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
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
}