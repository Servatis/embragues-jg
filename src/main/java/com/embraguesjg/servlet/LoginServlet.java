package com.embraguesjg.servlet;

import com.embraguesjg.dao.UserDAO;
import com.embraguesjg.modelo.User;
import com.embraguesjg.util.PasswordUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Map;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    private final UserDAO dao = new UserDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");

        String username = req.getParameter("username");
        String pass = req.getParameter("pass");

        if (username == null || username.isBlank() || pass == null || pass.isBlank()) {
            resp.sendError(400, "Usuario y contraseña son obligatorios");
            return;
        }

        try {
            // Necesitas un metodo en el DAO: buscar por username (o email)
            User user = dao.buscarPorUsername(username.trim());

            // Mismo mensaje en ambos casos: no revela si el usuario existe
            if (user == null || !user.isActive()
                    || !PasswordUtil.verify(pass, user.getPass())) {
                resp.sendError(401, "Credenciales inválidas");
                return;
            }

            // Evita session fixation: nueva sesión tras autenticar
            HttpSession old = req.getSession(false);
            if (old != null) old.invalidate();
            HttpSession session = req.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("role", user.getRoleId());
            session.setMaxInactiveInterval(30 * 60); // 30 min

            resp.setContentType("application/json;charset=UTF-8");
            mapper.writeValue(resp.getWriter(), Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "role_id", user.getRoleId()
            ));

        } catch (Exception e) {
            log("Error en login", e);
            resp.sendError(500, "Error al iniciar sesión");
        }
    }
}
