package com.embraguesjg.dao;

import com.embraguesjg.conexion.Conexion;
import com.embraguesjg.modelo.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ServiceDAO {
    // Guarda un registro con INSERT parametrizado
    public boolean guardar(Service service) throws SQLException {
        String sql = "INSERT INTO services (name, description, category_id, is_active) VALUES (?, ?, ?, ?)";
        // try-with-resources cierra la conexión y el statement
        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, service.getName());
            ps.setString(2, service.getDescription());
            ps.setInt(3, service.getCategory_id());
            ps.setBoolean(4, service.getIs_active());

            return ps.executeUpdate() > 0;
        }
    }
    // Actualizar un registro con UPDATE parametrizado
    public boolean actualizar(Service service) throws SQLException {
        String sql = "UPDATE services SET name = ?, description = ?, category_id = ?, is_active = ? WHERE id = ?";
        // try-with-resources cierra la conexión y el statement
        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, service.getName());
            ps.setString(2, service.getDescription());
            ps.setInt(3, service.getCategory_id());
            ps.setBoolean(4, service.getIs_active());
            ps.setInt(5, service.getId());

            return ps.executeUpdate() > 0;
        }
    }
    // Consulta registros con SELECT
    public List<Service> listar() throws SQLException {
        List<Service> serviceList = new ArrayList<>();
        String sql = "SELECT * FROM services ORDER BY id DESC";
        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Service service = new Service();
                service.setId(rs.getInt("id"));
                service.setName(rs.getString("name"));
                service.setDescription(rs.getString("description"));
                service.setCategory_id(rs.getInt("category_id"));
                service.setIs_active(rs.getBoolean("is_active"));
                serviceList.add(service);
            }
        }
        return serviceList;
    }
    // Eliminar un registro con DELETE parametrizado
    public boolean eliminar(int id) throws SQLException {
        String sql = "DELETE FROM services WHERE id = ?";
        // try-with-resources cierra la conexión y el statement
        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);

            return ps.executeUpdate() > 0;
        }
    }
}