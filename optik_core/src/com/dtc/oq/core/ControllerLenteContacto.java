/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.oq.core;

import com.dtc.oq.model.Lente_Contacto;
import com.dtc.oq.db.ConexionMySQL;
import com.dtc.oq.model.Producto;
import java.util.ArrayList;
import java.util.List;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.Types;


/**
 *
 * @author kenay
 */
public class ControllerLenteContacto {
    
   //este metodo nos va permitir ingresar datos a nuestra base de datos a traves de los registros de los campos
    //de lentes de contacto dentro de la pagina
   public int insert(Lente_Contacto lc) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarLenteContacto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"; 

        //Aquí guardaremos los ID's que se generarán:
        //Se les declara un valor -1 ya que en la base de datos un id < 0 esta fuera de rango
        int idProductoGenerado = -1;
        int idLenteContactoGenerado = -1;
        String codigoBarrasGenerado = "";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:        
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, lc.getProducto().getNombre());
        cstmt.setString(2, lc.getProducto().getMarca());
        cstmt.setDouble(3, lc.getProducto().getPrecioCompra());
        cstmt.setDouble(4, lc.getProducto().getPrecioVenta());
        cstmt.setInt(5, lc.getProducto().getExistencias());
        cstmt.setInt(6, lc.getKeratometria());
        cstmt.setString(7, lc.getFotografia());
        

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(8, Types.INTEGER);
        cstmt.registerOutParameter(9, Types.INTEGER);
        cstmt.registerOutParameter(10, Types.VARCHAR);
        
        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idProductoGenerado = cstmt.getInt(8);
        idLenteContactoGenerado = cstmt.getInt(9);
        codigoBarrasGenerado = cstmt.getString(10);
        //guardamos los valores de retorno en las variables temporales que creamos
        lc.setIdLenteContacto(idLenteContactoGenerado);
        lc.getProducto().setIdProducto(idProductoGenerado);
        lc.getProducto().setCodigoBarras(codigoBarrasGenerado);

        cstmt.close();
        
        //cerramos nuestra conexion con la base de datos
        connMySQL.close();

        //Devolvemos el ID de Cliente generado:
        return idLenteContactoGenerado;
    }
   
    /*Este metodo nos va permitir hacer modificaciones en los registros previos que ingresamos en nuestra base de datos
      y en nuestra pagina de manera que nos devuelve datos en los campos de la pagina de la optica para su modificacion 
   */
    public void update(Lente_Contacto lc) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarLenteContacto( ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
  

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, lc.getProducto().getNombre());
        cstmt.setString(2, lc.getProducto().getMarca());
        cstmt.setDouble(3, lc.getProducto().getPrecioCompra());
        cstmt.setDouble(4, lc.getProducto().getPrecioVenta());
        cstmt.setInt(5, lc.getProducto().getExistencias());
        cstmt.setInt(6, lc.getKeratometria());
        cstmt.setString(7, lc.getFotografia());
        

        cstmt.setInt(8, lc.getProducto().getIdProducto());
        cstmt.setInt(9, lc.getIdLenteContacto());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    //este metodo nos permite eliminar logicamente, màs no desaparece de la abse de datos, solo modifica el
    //estatus de nuestro producto cambiandolo a 0 para inactivo, y 1 para activo
    
    /*public void delete(int id) throws Exception {
        String sql = "UPDATE producto SET estatus = 0 WHERE idProducto = ?";
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        //Abrimos la conexion con la base de datos:
        
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, id);
        pstmt.executeUpdate();
        pstmt.close();
        connMySQL.close();
    }*/
    
    //Borrar un lente de contacto de nuestra base de datos, permite que no se refleje en nuestra tabla en la pagina
    public void delete(Lente_Contacto lc) throws Exception {
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
        cstmt.setInt(1, lc.getProducto().getIdProducto());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

   
    public List<Lente_Contacto> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql = "SELECT * FROM v_lentes_contacto where estatus=1;";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Lente_Contacto> lentes = new ArrayList<>();

        while (rs.next()) {
            lentes.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return lentes;
    }
    private Lente_Contacto fill(ResultSet rs) throws Exception {
        Lente_Contacto lc = new Lente_Contacto(); 
        Producto p = new Producto();

        p.setNombre(rs.getString("nombre"));
        p.setMarca(rs.getString("marca"));
        p.setPrecioCompra(rs.getDouble("precioCompra"));
        p.setPrecioVenta(rs.getDouble("precioVenta"));
        p.setExistencias(rs.getInt("existencias"));
        p.setCodigoBarras(rs.getString("codigoBarras"));
        p.setEstatus(rs.getInt("estatus"));
        p.setIdProducto(rs.getInt("idProducto"));
        
        lc.setIdLenteContacto(rs.getInt("idLenteContacto"));
        lc.setKeratometria(rs.getInt("keratometria"));
        lc.setFotografia(rs.getString("fotografia"));
    
        lc.setProducto(p);

        return lc;
    }
}
