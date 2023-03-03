/*|
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.oq.core;

import com.dtc.oq.db.ConexionMySQL;
import com.dtc.oq.model.Accesorio;
import com.dtc.oq.model.Producto;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.List;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;

/**
 *
 * @author Toxic
 */
public class ControllerAccesorio {

    public int insert(Accesorio a) throws Exception {
      //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarAccesorio(?, ?, ?, ?, ?, ?,"+ // Datos del producto
                                           "?, ?, ?)}";       // Valores de Retorno

        //Aquí guardaremos los ID's que se generarán:
        //Se les declara un valor -1 ya que en la base de datos un id < 0 esta fuera de rango
        int idProductoGenerado = -1;
        int idAccesorioGenerado = -1;
        String codigoBarrasGenerado = "";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:        
        CallableStatement cstmt = conn.prepareCall(sql);
        
        //Establecemos los parámetros de los datos del accesorio en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, a.getProducto().getCodigoBarras());
        cstmt.setString(2, a.getProducto().getNombre());
        cstmt.setString(3, a.getProducto().getMarca());
        cstmt.setDouble(4, a.getProducto().getPrecioCompra());
        cstmt.setDouble(5, a.getProducto().getPrecioVenta());
        cstmt.setInt(6, a.getProducto().getExistencias());
        

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(7, Types.INTEGER);
        cstmt.registerOutParameter(8, Types.INTEGER);
        cstmt.registerOutParameter(9, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idProductoGenerado = cstmt.getInt(7);
        idAccesorioGenerado = cstmt.getInt(8);
        codigoBarrasGenerado = cstmt.getString(9);

        a.setIdAccesorio(idAccesorioGenerado);
        a.getProducto().setCodigoBarras(codigoBarrasGenerado);
        a.getProducto().setIdProducto(idProductoGenerado);
        
        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID del Accesorio
        return idAccesorioGenerado;
    }
    
    public void update(Accesorio a) throws Exception {
         //Definimos la consulta SQL que invoca al Procedimiento Almacenado
        String sql = "{call actualizarAccesorio( ?, ?, ?, ?, ?, ?, ?)}"; // Datos del producto
                                               // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, a.getProducto().getCodigoBarras());
        cstmt.setString(2, a.getProducto().getNombre());
        cstmt.setString(3, a.getProducto().getMarca());
        cstmt.setDouble(4, a.getProducto().getPrecioCompra());
        cstmt.setDouble(5, a.getProducto().getPrecioVenta());
        cstmt.setInt(6, a.getProducto().getExistencias());
        
        cstmt.setInt(7, a.getProducto().getIdProducto());
        
        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }
    
    //Eliminacion Logica de un Producto
    public void delete(Accesorio a) throws Exception {
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
        cstmt.setInt(1, a.getProducto().getIdProducto());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public List<Accesorio> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql = "SELECT * FROM v_accesorios where estatus=1;";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Accesorio> accesorio = new ArrayList<>();

        while (rs.next()) {
            accesorio.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return accesorio;
    }

    private Accesorio fill(ResultSet rs) throws Exception {
        Accesorio ac = new Accesorio();
        Producto p = new Producto();
        
        p.setIdProducto(rs.getInt("idProducto"));
        p.setCodigoBarras(rs.getString("codigoBarras"));
        p.setNombre(rs.getString("nombre"));
        p.setMarca(rs.getString("marca"));
        p.setPrecioCompra(rs.getDouble("precioCompra"));
        p.setPrecioVenta(rs.getDouble("precioVenta"));
        p.setExistencias(rs.getInt("existencias"));
        p.setEstatus(rs.getInt("estatus"));
        
        ac.setIdAccesorio(rs.getInt("idAccesorio"));
        ac.setProducto(p);
        
        return ac;
        }
        
    }