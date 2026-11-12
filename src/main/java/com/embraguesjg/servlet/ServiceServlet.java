package com.embraguesjg.servlet;

import com.embraguesjg.dao.ServiceDAO;
import com.embraguesjg.modelo.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/api/service")
public class ServiceServlet extends HttpServlet {
    private final ServiceDAO dao = new ServiceDAO();
    private final ObjectMapper mapper = new ObjectMapper();
    // GET: devuelve lista en formato JSON
    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        try {
            List<Service> serviceList = dao.listar();
            mapper.writeValue(response.getWriter(), serviceList);
        } catch (SQLException e) {
            log("Error consultando registros", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error al consultar registros");
        }
    }
    // POST: recibe y guarda datos del servicio
    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        String name = request.getParameter("name");
        String description = request.getParameter("description");
        String category_id = request.getParameter("category_id");
        String is_active = request.getParameter("is_active");

        if (name.isBlank() || description.isBlank() || category_id.isBlank() || is_active.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Todos los campos son obligatorios");
            return;
        }
        Service service = new Service(name, description, Integer.parseInt(category_id), Boolean.parseBoolean(is_active));
        try {
            boolean guardado = dao.guardar(service);
            if (guardado) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                mapper.writeValue(response.getWriter(), service);
            } else {
                response.sendError(
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "No se pudo registrar");
            }
        } catch (SQLException e) {
            log("Error registrando servicio", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error al registrar servicio");
        }
    }
    // PUT: recibe y actualizar datos del servicio
    @Override
    protected void doPut(HttpServletRequest request,
                          HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        Service service;
        try {
            service = mapper.readValue(request.getInputStream(), Service.class);
        } catch (IOException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "JSON inválido");
            return;
        }

       try {
            boolean guardado = dao.actualizar(service);
            if (guardado) {
                response.setStatus(HttpServletResponse.SC_OK);
                mapper.writeValue(response.getWriter(), service);
            } else {
                response.sendError(
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "No se pudo registrar");
            }
        } catch (SQLException e) {
            log("Error registrando servicio", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error al registrar servicio");
        }
    }
    // DELETE: eliminar servicio
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
            log("Error eliminando servicio", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error al eliminar servicio");
        }
    }
}