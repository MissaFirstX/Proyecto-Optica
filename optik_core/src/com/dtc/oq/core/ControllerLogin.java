/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.oq.core;

import com.dtc.oq.db.ConexionMySQL;
import com.dtc.oq.model.Empleado;
import com.dtc.oq.model.Persona;
import com.dtc.oq.model.Usuario;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 *
 * @author Toxic
 */
public class ControllerLogin {

    public Empleado login(String usuario, String contrasenia) throws Exception {
        //La consulta SQL a ejecutar:
        String sql = "SELECT * FROM v_empleados WHERE nombreUsuario = ? AND contrasenia = ?";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        pstmt.setString(1, usuario);
        pstmt.setString(2, contrasenia);
        ResultSet rs = pstmt.executeQuery();

        Empleado emp = null;

        if (rs.next()) {

            emp = fill(rs);

        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return emp;
    }

    private Empleado fill(ResultSet rs) throws Exception {
        Empleado e = new Empleado();
        Persona p = new Persona();

        p.setApellidoMaterno(rs.getString("apellidoMaterno"));
        p.setApellidoPaterno(rs.getString("apellidoPaterno"));
        p.setCalle(rs.getString("calle"));
        p.setCiudad(rs.getString("ciudad"));
        p.setColonia(rs.getString("colonia"));
        p.setCp(rs.getString("cp"));
        p.setEmail(rs.getString("email"));
        p.setEstado(rs.getString("estado"));
        p.setFechaNacimiento(rs.getString("fechaNacimiento"));
        p.setGenero(rs.getString("genero"));
        p.setIdPersona(rs.getInt("idPersona"));
        p.setNombre(rs.getString("nombre"));
        p.setNumero(rs.getString("numero"));
        p.setTelCasa(rs.getString("telcasa"));
        p.setTelMovil(rs.getString("telmovil"));

        e.setIdEmpleado(rs.getInt("idEmpleado"));
        e.setNumeroUnico(rs.getString("numeroUnico"));
        e.setUsuario(new Usuario());
        e.getUsuario().setContrasenia(rs.getString("contrasenia"));
        e.getUsuario().setIdUsuario(rs.getInt("idUsuario"));
        e.getUsuario().setNombre(rs.getString("nombreUsuario"));
        e.getUsuario().setRol(rs.getString("rol"));
        e.getUsuario().setLastToken(rs.getString("lastToken"));
        e.getUsuario().setDateLastToken(rs.getString("dateLastToken"));
        e.setNumeroUnico(rs.getString("numeroUnico"));

        e.setPersona(p);

        return e;
    }

    public void guardarToken(Empleado e) throws Exception {
        String query = "UPDATE usuario SET lastToken=?,dateLastToken = NOW() WHERE idUsuario = ?";
        ConexionMySQL cm = new ConexionMySQL();
        Connection con = cm.open();
        PreparedStatement ps = con.prepareCall(query);

        ps.setString(1, e.getUsuario().getLastToken());
        ps.setInt(2, e.getUsuario().getIdUsuario());

        ps.execute();
        ps.close();
        con.close();
        cm.close();

    }

    public String setToken() {
        SecureRandom random = new SecureRandom();
        byte bytes[] = new byte[20];
        random.nextBytes(bytes);
        String token = bytes.toString();
        return token;
    }

    public boolean eliminarToken(Usuario u) throws Exception {
        boolean r = false;
        String query = "UPDATE usuario SET lastToken='' WHERE idUsuario=?";
        ConexionMySQL conexionMySQL = new ConexionMySQL();
        Connection connection = conexionMySQL.open();
        PreparedStatement preparedStatement = connection.prepareCall(query);
        
        preparedStatement.setInt(1, u.getIdUsuario());

        r = preparedStatement.execute();
        r = true;

        preparedStatement.close();
        connection.close();
        conexionMySQL.close();

        return r;
    }

    public boolean validarToken(String t) throws Exception {
        boolean r = false;
        String query = "SELECT * FROM v_empleados WHERE lastToken='" + t + "'";
        ConexionMySQL conexionMySQL = new ConexionMySQL();
        Connection connection = conexionMySQL.open();
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        if (rs.next()) {
            r = true;
        }

        stmt.close();
        connection.close();
        conexionMySQL.close();

        return r;
    }
    
    //function fechaBien(fecha){
    //fecha.toString();
    
    //let annio = fecha.substring(6,10);
    //let mes = fecha.substring(3,5);
    //let dia = fecha.substring(0,2);
    //let hora = fecha.substring(11,18);
   
    //let fecha2 = annio+"-"+mes+"-"+dia+""+hora;
    
    //return fecha2;
    //}

}
