package com.hna.webserver.config;

import com.hna.webserver.dto.ItemRequest;
import com.hna.webserver.model.Color;
import com.hna.webserver.model.Item;
import com.hna.webserver.model.Size;
import com.hna.webserver.model.Type;
import com.hna.webserver.model.User;
import com.hna.webserver.repository.ItemRepository;
import com.hna.webserver.repository.UserRepository;
import com.hna.webserver.service.ItemService;
import com.hna.webserver.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/**
 * Idempotent dev dataset: fixed users and ~100 catalog items with Unsplash images.
 * Invoked from {@link DevDataSeedCliRunner} via {@code ./gradlew seed} / {@code ./sail backend:seed}.
 */
@Service
public class DevDataSeedService {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeedService.class);

    /** If this user exists, the full seed has already been applied. */
    public static final String SEED_MARKER_EMAIL = "seed.seller@example.com";

    public static final String SEED_SELLER2_EMAIL = "seed.seller2@example.com";
    public static final String SEED_BUYER_EMAIL = "seed.buyer@example.com";

    /** Shared password for all seed accounts (dev only). */
    public static final String SEED_PASSWORD = "password123";

    private static final int TARGET_ITEM_COUNT = 100;

    /**
     * Curated Unsplash fashion/clothing URLs (fixed IDs — stable, deterministic).
     */
    private static final String[] UNSPLASH_IMAGES = {
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
            "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
            "https://images.unsplash.com/photo-1515347619252-60a973bf4d40?w=600&q=80",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
            "https://images.unsplash.com/photo-1582552938357-32b906dfc8bc?w=600&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
    };

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final UserService userService;
    private final ItemService itemService;

    public DevDataSeedService(
            UserRepository userRepository,
            ItemRepository itemRepository,
            UserService userService,
            ItemService itemService) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.userService = userService;
        this.itemService = itemService;
    }

    @Transactional
    public void seedIfNeeded() {
        if (userRepository.findByEmail(SEED_MARKER_EMAIL).isPresent()) {
            log.info("Dev data seed skipped (marker user {} already exists)", SEED_MARKER_EMAIL);
            return;
        }

        User seller1 = userService.createUser("Seed Seller", SEED_PASSWORD, SEED_MARKER_EMAIL);
        User seller2 = userService.createUser("Seed Seller Two", SEED_PASSWORD, SEED_SELLER2_EMAIL);
        User buyer = userService.createUser("Seed Buyer", SEED_PASSWORD, SEED_BUYER_EMAIL);

        log.info("Created seed users: {}, {}, {}", SEED_MARKER_EMAIL, SEED_SELLER2_EMAIL, SEED_BUYER_EMAIL);

        int index = 0;
        outer:
        for (Type type : Type.values()) {
            for (Size size : Size.values()) {
                for (Color color : Color.values()) {
                    if (index >= TARGET_ITEM_COUNT) {
                        break outer;
                    }
                    User owner = index % 2 == 0 ? seller1 : seller2;
                    ItemRequest req = buildItemRequest(index, type, size, color);
                    itemService.createItem(req, owner);
                    index++;
                }
            }
        }

        log.info("Seeded {} deterministic catalog items", index);

        favoriteSampleForBuyer(buyer);
    }

    private static ItemRequest buildItemRequest(int index, Type type, Size size, Color color) {
        ItemRequest req = new ItemRequest();
        String typeLabel = titleCase(type.name());
        String sizeLabel = size.name();
        String colorLabel = titleCase(color.name());
        req.setName(String.format("Seed %03d — %s %s %s", index + 1, colorLabel, sizeLabel, typeLabel));
        req.setDescription(String.format(
                "Deterministic dev item %d. %s %s in %s. Search keywords: seed catalog %s %s.",
                index + 1,
                typeLabel,
                sizeLabel,
                colorLabel,
                type.name().toLowerCase(),
                color.name().toLowerCase()));
        req.setPrice(12 + (index * 37) % 188);
        req.setSize(size);
        req.setType(type);
        req.setColor(color);
        req.setImage(UNSPLASH_IMAGES[index % UNSPLASH_IMAGES.length]);
        return req;
    }

    private static String titleCase(String enumName) {
        return enumName.charAt(0) + enumName.substring(1).toLowerCase();
    }

    private void favoriteSampleForBuyer(User buyer) {
        List<Item> items = itemRepository.findAll().stream()
                .sorted(Comparator.comparing(Item::getId))
                .toList();
        int step = Math.max(1, items.size() / 12);
        int favorited = 0;
        for (int i = 0; i < items.size() && favorited < 12; i += step) {
            try {
                itemService.favoriteItem(items.get(i).getId(), buyer);
                favorited++;
            } catch (Exception e) {
                log.warn("Could not favorite item for seed buyer: {}", e.getMessage());
            }
        }
        log.info("Attached {} favorites to {}", favorited, SEED_BUYER_EMAIL);
    }
}
