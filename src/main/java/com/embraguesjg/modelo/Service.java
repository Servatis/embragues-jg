package com.embraguesjg.modelo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Service {
    private int id;
    private String name;
    private String description;
    private int category_id;
    private boolean is_active;

    public Service() {
    }

    public Service(String name, String description, int category_id, boolean is_active) {
        this.name = name;
        this.description = description;
        this.category_id = category_id;
        this.is_active = is_active;
    }

    public Service(int id, String name, String description, int category_id, boolean is_active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category_id = category_id;
        this.is_active = is_active;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public boolean getIs_active() {
        return is_active;
    }

    public void setIs_active(boolean is_active) {
        this.is_active = is_active;
    }
}