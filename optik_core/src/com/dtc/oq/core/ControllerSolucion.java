/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.oq.core;

import com.dtc.oq.db.ConexionMySQL;
import com.dtc.oq.model.Producto;
import com.dtc.oq.model.Solucion;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Toxic
 */
public class ControllerSolucion {

    public int insert(Solucion s) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarSolucion(?,?,?,?,?,?,?,?,?)}";

        int idProductoGenerado = -1;
        int idSolucionGenerado = -1;
        String codigoBarrasGenerado = null;

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:        
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, s.getProducto().getCodigoBarras());
        cstmt.setString(2, s.getProducto().getNombre());
        cstmt.setString(3, s.getProducto().getMarca());
        cstmt.setDouble(4, s.getProducto().getPrecioCompra());
        cstmt.setDouble(5, s.getProducto().getPrecioVenta());
        cstmt.setInt(6, s.getProducto().getExistencias());
        cstmt.registerOutParameter(7, Types.INTEGER);
        cstmt.registerOutParameter(8, Types.INTEGER);
        cstmt.registerOutParameter(9, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        idProductoGenerado = cstmt.getInt(7);
        idSolucionGenerado = cstmt.getInt(8);
        codigoBarrasGenerado = cstmt.getString(9);

        s.getProducto().setIdProducto(idProductoGenerado);
        s.setIdSolucion(idSolucionGenerado);
        s.getProducto().setCodigoBarras(codigoBarrasGenerado);

        cstmt.close();
        connMySQL.close();

        return idSolucionGenerado;
    }

    public void update(Solucion s) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarSolucion(?,?,?,?,?,?,?)}";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:        
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, s.getProducto().getCodigoBarras());
        cstmt.setString(2, s.getProducto().getNombre());
        cstmt.setString(3, s.getProducto().getMarca());
        cstmt.setDouble(4, s.getProducto().getPrecioCompra());
        cstmt.setDouble(5, s.getProducto().getPrecioVenta());
        cstmt.setInt(6, s.getProducto().getExistencias());
        cstmt.setInt(7, s.getProducto().getIdProducto());
        

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }
    
    public void eliminar(Solucion s) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call eliminarProducto(?)}";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:        
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setInt(1, s.getProducto().getIdProducto());        

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public List<Solucion> getAll(String filtro) throws Exception {

        //La consulta SQL a ejecutar:
        String sql = "SELECT * FROM v_soluciones WHERE estatus = 1";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Solucion> soluciones = new ArrayList<>();

        while (rs.next()) {
            soluciones.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return soluciones;
    }

    private Solucion fill(ResultSet rs) throws Exception {
        Solucion s = new Solucion();
        Producto p = new Producto();

        p.setIdProducto(rs.getInt("idProducto"));
        p.setCodigoBarras(rs.getString("codigoBarras"));
        p.setNombre(rs.getString("nombre"));
        p.setMarca(rs.getString("marca"));
        p.setPrecioCompra(rs.getDouble("precioCompra"));
        p.setPrecioVenta(rs.getDouble("precioVenta"));
        p.setExistencias(rs.getInt("existencias"));
        p.setEstatus(rs.getInt("estatus"));

        s.setIdSolucion(rs.getInt("idSolucion"));
        s.setProducto(p);

        return s;
    }
}
