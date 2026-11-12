package com.embraguesjg.dao;

import com.embraguesjg.conexion.Conexion;
import com.embraguesjg.modelo.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    // Mapea una fila a User. Incluye el hash solo si la consulta lo pide.
    private User mapear(ResultSet rs, boolean incluirPass) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        user.setRoleId(rs.getInt("role_id"));
        user.setImage(rs.getString("image"));
        user.setActive(rs.getBoolean("is_active"));
        if (incluirPass) {
            user.setPass(rs.getString("pass"));
        }
        return user;
    }

    // Registrar usuario
    public boolean guardar(User user) throws SQLException {
        String sql = "INSERT INTO users (name, username, email, pass, role_id, image, is_active) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, user.getName());
            ps.setString(2, user.getUsername());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPass());      // ya viene hasheado
            ps.setInt(5, user.getRoleId());
            ps.setString(6, user.getImage());
            ps.setBoolean(7, user.isActive());

            return ps.executeUpdate() > 0;
        }
    }

    // Buscar por username (para el login). Incluye el hash.
    public User buscarPorUsername(String username) throws SQLException {
        String sql = "SELECT id, name, username, email, pass, role_id, image, is_active "
                + "FROM users WHERE username = ? OR email = ?";

        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, username);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs, true) : null;
            }
        }
    }

    // Consultar todos los usuarios (sin hash)
    public List<User> listar() throws SQLException {
        List<User> users = new ArrayList<>();

        String sql = "SELECT id, name, username, email, role_id, image, is_active "
                + "FROM users ORDER BY id DESC";

        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                users.add(mapear(rs, false));
            }
        }
        return users;
    }

    // Actualizar usuario
    public boolean actualizar(User user) throws SQLException {
        String sql = "UPDATE users SET name = ?, username = ?, email = ?, pass = COALESCE(NULLIF(?, ''), pass), role_id = ?, image = ?, is_active = ? WHERE id = ?";

        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, user.getName());
            ps.setString(2, user.getUsername());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPass());
            ps.setInt(5, user.getRoleId());
            ps.setString(6, user.getImage());
            ps.setBoolean(7, user.isActive());
            ps.setInt(8, user.getId());

            return ps.executeUpdate() > 0;
        }
    }

    // Eliminar usuario
    public boolean eliminar(int id) throws SQLException {
        String sql = "DELETE FROM users WHERE id = ?";

        try (Connection con = Conexion.conectar();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }
}