package com.embraguesjg.modelo;

public class ContactForm {
    private int id;
    private String name;
    private String phone;
    private String email;
    private String service;
    private String message;
    private String date;

    public ContactForm() {
    }

    public ContactForm(String name, String phone, String email, String service, String message) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.service = service;
        this.message = message;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}