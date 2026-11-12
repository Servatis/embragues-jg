package com.embraguesjg.dao;

import com.embraguesjg.conexion.Conexion;
import com.embraguesjg.modelo.ContactForm;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ContactFormDAO {
    // Guarda un registro con INSERT parametrizado
    public boolean guardar(ContactForm contactForm) throws SQLException {
        String sql = "INSERT INTO contact_form (name, phone, email, service, message) VALUES (?, ?, ?, ?, ?)";
        // try-with-resources cierra la conexión y el statement
        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, contactForm.getName());
            ps.setString(2, contactForm.getPhone());
            ps.setString(3, contactForm.getEmail());
            ps.setString(4, contactForm.getService());
            ps.setString(5, contactForm.getMessage());

            return ps.executeUpdate() > 0;
        }
    }
    // Consulta registros con SELECT
    public List<ContactForm> listar() throws SQLException {
        List<ContactForm> contactList = new ArrayList<>();
        String sql = "SELECT * FROM contact_form ORDER BY id DESC";
        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                ContactForm contactForm = new ContactForm();
                contactForm.setId(rs.getInt("id"));
                contactForm.setName(rs.getString("name"));
                contactForm.setPhone(rs.getString("phone"));
                contactForm.setEmail(rs.getString("email"));
                contactForm.setService(rs.getString("service"));
                contactForm.setMessage(rs.getString("message"));
                contactForm.setDate(rs.getString("date"));
                contactList.add(contactForm);
            }
        }
        return contactList;
    }
    // Eliminar un registro con DELETE parametrizado
    public boolean eliminar(int id) throws SQLException {
        String sql = "DELETE FROM contact_form WHERE id = ?";
        // try-with-resources cierra la conexión y el statement
        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);

            return ps.executeUpdate() > 0;
        }
    }
}