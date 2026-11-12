package com.embraguesjg.servlet;

import com.embraguesjg.dao.ContactFormDAO;
import com.embraguesjg.modelo.ContactForm;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/api/contact_form")
public class ContactFormServlet extends HttpServlet {
    private final ContactFormDAO dao = new ContactFormDAO();
    private final ObjectMapper mapper = new ObjectMapper();
    // GET: devuelve lista en formato JSON
    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        try {
            List<ContactForm> contactList = dao.listar();
            mapper.writeValue(response.getWriter(), contactList);
        } catch (SQLException e) {
            log("Error consultando registros", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error al consultar registros");
        }
    }
    // POST: recibe y guarda datos del formulario
    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        String name = request.getParameter("name");
        String phone = request.getParameter("phone");
        String email = request.getParameter("email");
        String service = request.getParameter("service");
        String message = request.getParameter("message");

        if (name.isBlank() || phone.isBlank() || email.isBlank() || service.isBlank() || message.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Todos los campos son obligatorios");
            return;
        }
        ContactForm contactForm = new ContactForm(name, phone, email, service, message);
        try {
            boolean guardado = dao.guardar(contactForm);
            if (guardado) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                mapper.writeValue(response.getWriter(), contactForm);
            } else {
                response.sendError(
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "No se pudo registrar");
            }
        } catch (SQLException e) {
            log("Error registrando formulario", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error al registrar formulario");
        }
    }
    // DELETE: eliminar registro
    @Override
    protected void doDelete(HttpServletRequest request,
                            HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        String id = request.getParameter("id");

        if (id.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Todos los campos son obligatorios");
            return;
        }
        try {
            boolean eliminado = dao.eliminar(Integer.parseInt(id));
            if (eliminado) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.sendError(
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "No se pudo eliminar");
            }
        } catch (SQLException e) {
            log("Error eliminando registro", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error al eliminar registro");
        }
    }
}