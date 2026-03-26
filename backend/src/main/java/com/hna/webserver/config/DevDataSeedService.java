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
 * Idempotent dev dataset: fixed users and ~100 catalog items.
 * Images are served from the Next.js app as {@code /images/unsplash/*.jpg} (offline-friendly).
 * Refresh assets: {@code npm run download-seed-images} in {@code frontend/}.
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

    /** Tops, shirts, sweaters (local cached files). */
    private static final String[] UNSPLASH_TOPS = {
            "/images/unsplash/tops-01.jpg",
            "/images/unsplash/tops-02.jpg",
            "/images/unsplash/tops-03.jpg",
            "/images/unsplash/tops-04.jpg",
            "/images/unsplash/tops-05.jpg",
            "/images/unsplash/tops-06.jpg",
            "/images/unsplash/tops-01.jpg",
            "/images/unsplash/tops-02.jpg",
    };

    /** Jeans, pants, shorts (local cached files). */
    private static final String[] UNSPLASH_BOTTOMS = {
            "/images/unsplash/bottoms-01.jpg",
            "/images/unsplash/bottoms-02.jpg",
            "/images/unsplash/bottoms-03.jpg",
            "/images/unsplash/bottoms-01.jpg",
            "/images/unsplash/bottoms-02.jpg",
            "/images/unsplash/bottoms-03.jpg",
            "/images/unsplash/bottoms-01.jpg",
            "/images/unsplash/bottoms-02.jpg",
    };

    /** Dresses (local cached files). */
    private static final String[] UNSPLASH_DRESSES = {
            "/images/unsplash/dresses-01.jpg",
            "/images/unsplash/dresses-02.jpg",
            "/images/unsplash/dresses-03.jpg",
            "/images/unsplash/dresses-04.jpg",
            "/images/unsplash/dresses-05.jpg",
            "/images/unsplash/dresses-01.jpg",
            "/images/unsplash/dresses-02.jpg",
            "/images/unsplash/dresses-03.jpg",
    };

    /** Footwear. */
    private static final String[] UNSPLASH_SHOES = {
            "/images/unsplash/shoes-01.jpg",
            "/images/unsplash/shoes-02.jpg",
            "/images/unsplash/shoes-03.jpg",
            "/images/unsplash/shoes-04.jpg",
            "/images/unsplash/shoes-05.jpg",
            "/images/unsplash/shoes-06.jpg",
            "/images/unsplash/shoes-07.jpg",
            "/images/unsplash/shoes-08.jpg",
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

        /*
         * Round-robin by type first so a fixed count (~100) still includes every Type.
         * (Nested type→size→color would use all 66 TOPS combos before BOTTOMS, and never reach
         * DRESSES or SHOES within 100 items.)
         */
        Type[] types = Type.values();
        Size[] sizes = Size.values();
        Color[] colors = Color.values();
        int typeCount = types.length;
        int sizeCount = sizes.length;

        for (int index = 0; index < TARGET_ITEM_COUNT; index++) {
            Type type = types[index % typeCount];
            Size size = sizes[(index / typeCount) % sizeCount];
            Color color = colors[(index / (typeCount * sizeCount)) % colors.length];
            User owner = index % 2 == 0 ? seller1 : seller2;
            ItemRequest req = buildItemRequest(index, type, size, color);
            itemService.createItem(req, owner);
        }

        log.info("Seeded {} deterministic catalog items", TARGET_ITEM_COUNT);

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
        req.setImage(imageUrlForType(type, index));
        return req;
    }

    private static String imageUrlForType(Type type, int index) {
        String[] pool = switch (type) {
            case TOPS -> UNSPLASH_TOPS;
            case BOTTOMS -> UNSPLASH_BOTTOMS;
            case DRESSES -> UNSPLASH_DRESSES;
            case SHOES -> UNSPLASH_SHOES;
        };
        return pool[index % pool.length];
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
