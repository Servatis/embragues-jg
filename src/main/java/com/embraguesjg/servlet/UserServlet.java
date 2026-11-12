package com.embraguesjg.servlet;

import com.embraguesjg.dao.UserDAO;
import com.embraguesjg.modelo.User;
import com.embraguesjg.util.PasswordUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/user")
public class UserServlet extends HttpServlet {

    private final UserDAO dao = new UserDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    // GET: consultar usuarios
    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response) throws IOException {

        response.setContentType("application/json;charset=UTF-8");

        try {
            List<User> users = dao.listar();
            mapper.writeValue(response.getWriter(), users);

        } catch (Exception e) {
            log("Error consultando usuarios", e);
            response.sendError(500, "Error al consultar usuarios");
        }
    }

    // POST: registrar usuario
    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws IOException {

        request.setCharacterEncoding("UTF-8");

        String name = request.getParameter("name");
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String pass = request.getParameter("pass");
        String role_id = request.getParameter("role_id");
        String image = request.getParameter("image");
        String is_active = request.getParameter("is_active");

        String imageVal = image == null ? "" : image.trim();
        int roleIdVal = (role_id == null || role_id.isBlank()) ? 3 : Integer.parseInt(role_id);

        if (name == null || name.isBlank()
                || username == null || username.isBlank()
                || email == null || email.isBlank()
                || pass == null || pass.isBlank()) {

            response.sendError(400, "Todos los campos son obligatorios");
            return;
        }

        try {
            String hash = PasswordUtil.hash(pass);

            User user = new User(
                    name.trim(),
                    username.trim(),
                    email.trim(),
                    hash,
                    roleIdVal,
                    imageVal.trim(),
                    Boolean.parseBoolean(is_active)
            );

            if (dao.guardar(user)) {
                response.setStatus(201);
            } else {
                response.sendError(500, "No se pudo registrar");
            }

        } catch (Exception e) {
            log("Error registrando usuario", e);
            response.sendError(500, "Error al registrar usuario");
        }
    }

    // PUT: actualizar usuario
    @Override
    protected void doPut(HttpServletRequest request,
                         HttpServletResponse response) throws IOException {

        request.setCharacterEncoding("UTF-8");

        try {
            User user = mapper.readValue(
                    request.getInputStream(), User.class);

            if (user.getId() <= 0
                    || user.getName() == null
                    || user.getName().isBlank()
                    || user.getUsername() == null
                    || user.getUsername().isBlank()) {

                response.sendError(400, "Datos inválidos");
                return;
            }

            if (!user.getPass().isBlank()) {
                String hash = PasswordUtil.hash(user.getPass());
                user.setPass(hash);
            }

            if (dao.actualizar(user)) {
                response.setStatus(200);
            } else {
                response.sendError(404, "User no encontrado");
            }

        } catch (Exception e) {
            log("Error actualizando usuario", e);
            response.sendError(500, "Error al actualizar usuario");
        }
    }

    // DELETE: eliminar usuario
    @Override
    protected void doDelete(HttpServletRequest request,
                            HttpServletResponse response) throws IOException {

        String idTexto = request.getParameter("id");

        try {
            int id = Integer.parseInt(idTexto);

            if (dao.eliminar(id)) {
                response.setStatus(200);
            } else {
                response.sendError(404, "User no encontrado");
            }

        } catch (Exception e) {
            response.sendError(400, "Identificador inválido");
        }
    }
}