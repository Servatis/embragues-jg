package com.embraguesjg.conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {
    // URL de la base de datos local
    private static final String URL =
            "jdbc:mysql://localhost:3306/embragues_jg?connectionTimeZone=UTC";
    // Cambiar según la instalación local
    private static final String USUARIO = "embragues_jg";
    private static final String CLAVE = "gp3U0O/fBtQnA@[l";
    // Entrega una conexión JDBC abierta
    public static Connection conectar() throws SQLException {
        return DriverManager.getConnection(URL, USUARIO, CLAVE);
    }
}