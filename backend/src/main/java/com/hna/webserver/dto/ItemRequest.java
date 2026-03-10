package com.hna.webserver.dto;

import com.hna.webserver.model.Color;
import com.hna.webserver.model.Size;
import com.hna.webserver.model.Type;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ItemRequest {

    @NotBlank
    private String name;

    @NotNull
    @Min(0)
    private Integer price;

    @NotNull
    private Size size;

    @NotNull
    private Type type;

    @NotNull
    private Color color;

    private String image;

    private String description;

    public ItemRequest() {
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

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
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
}
