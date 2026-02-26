package com.hna.webserver.dto;

import com.hna.webserver.model.Item;
import java.time.LocalDateTime;

public class ItemResponse {

    private Long id;
    private String name;
    private Integer price;
    private String size;
    private String type;
    private String color;
    private String image;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private Integer favoriteCount = 0;
    private Boolean favorited = false;

    public ItemResponse() {
    }

    public ItemResponse(Item item) {
        this(item, null);
    }

    public ItemResponse(Item item, Integer favoriteCount) {
        this.id = item.getId();
        this.name = item.getName();
        this.price = item.getPrice();
        this.size = item.getSize();
        this.type = item.getType();
        this.color = item.getColor();
        this.image = item.getImage();
        this.description = item.getDescription();
        this.createdAt = item.getCreatedAt();
        this.updatedAt = item.getUpdatedAt();
        this.userId = item.getUser() != null ? item.getUser().getId() : null;
        
        // If favoriteCount is provided, use it; otherwise try to get it from the item
        if (favoriteCount != null) {
            this.favoriteCount = favoriteCount;
        } else {
            // Safely try to access the collection; if lazy initialization fails, default to 0
            try {
                this.favoriteCount = item.getFavoritedBy() != null ? item.getFavoritedBy().size() : 0;
            } catch (org.hibernate.LazyInitializationException e) {
                this.favoriteCount = 0;
            }
        }
    }

    public Integer getFavoriteCount() {
        return favoriteCount;
    }

    public void setFavoriteCount(Integer favoriteCount) {
        this.favoriteCount = favoriteCount;
    }

    public Boolean getFavorited() {
        return favorited;
    }

    public void setFavorited(Boolean favorited) {
        this.favorited = favorited;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
