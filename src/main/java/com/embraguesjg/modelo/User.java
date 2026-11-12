package com.embraguesjg.modelo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

    private int id;
    private String name;
    private String username;
    private String email;

    // Se puede recibir en el JSON, pero nunca se envía al cliente
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String pass;

    private int roleId;
    private String image;
    private boolean active;

    public User() {}

    public User(String name, String username, String email, String pass,
                int roleId, String image, boolean active) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.pass = pass;
        this.roleId = roleId;
        this.image = image;
        this.active = active;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPass() { return pass; }
    public void setPass(String pass) { this.pass = pass; }

    @JsonProperty("role_id")
    public int getRoleId() { return roleId; }
    @JsonProperty("role_id")
    public void setRoleId(int roleId) { this.roleId = roleId; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    @JsonProperty("is_active")
    public boolean isActive() { return active; }
    @JsonProperty("is_active")
    public void setActive(boolean active) { this.active = active; }
}