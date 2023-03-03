/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.oq.core;

import com.dtc.oq.db.ConexionMySQL;
import com.dtc.oq.model.Armazon;
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
 * @author Toxic
 */
public class ControllerArmazon {

    //metodo para insertar
    public int insert(Armazon e) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarArmazon(?, ?, ?, ?, ?, "+ // Datos del producto
                                           "?, ?, ?, ?, ?, " + // Datos de armazon
                                           "?, ?, ?)}";       // Valores de Retorno

        //Aquí guardaremos los ID's que se generarán:
        //Se les declara un valor -1 ya que en la base de datos un id < 0 esta fuera de rango
        int idProductoGenerado = -1;
        int idArmazonGenerado = -1;
        String codigoBarrasGenerado = "";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:        
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos del producto en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, e.getProducto().getNombre());
        cstmt.setString(2, e.getProducto().getMarca());
        cstmt.setDouble(3, e.getProducto().getPrecioCompra());
        cstmt.setDouble(4, e.getProducto().getPrecioVenta());
        cstmt.setInt(5, e.getProducto().getExistencias());
        

        // Registramos parámetros del armazon:
        cstmt.setString(6, e.getModelo());
        cstmt.setString(7, e.getColor());
        cstmt.setString(8, e.getDimensiones());
        cstmt.setString(9, e.getDescripcion());
        cstmt.setString(10, e.getFotografia());

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(11, Types.INTEGER);
        cstmt.registerOutParameter(12, Types.INTEGER);
        cstmt.registerOutParameter(13, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idProductoGenerado = cstmt.getInt(11);
        idArmazonGenerado = cstmt.getInt(12);
        codigoBarrasGenerado = cstmt.getString(13);

        e.setIdArmazon(idArmazonGenerado);
        e.getProducto().setCodigoBarras(codigoBarrasGenerado);
        e.getProducto().setIdProducto(idProductoGenerado);
        
        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de Cliente generado:
        return idArmazonGenerado;
    }
    
    //metodo para actualizar
    public void update(Armazon e) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarArmazon(?, ?, ?, ?, ?, "+ // Datos del producto
                                              "?, ?, ?, ?, ?, " + // Datos de armazon
                                              "?, ?)}"; // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos del producto en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, e.getProducto().getNombre());
        cstmt.setString(2, e.getProducto().getMarca());
        cstmt.setDouble(3, e.getProducto().getPrecioCompra());
        cstmt.setDouble(4, e.getProducto().getPrecioVenta());
        cstmt.setInt(5, e.getProducto().getExistencias());
        
        cstmt.setString(6, e.getModelo());
        cstmt.setString(7, e.getColor());
        cstmt.setString(8, e.getDimensiones());
        cstmt.setString(9, e.getDescripcion());
        cstmt.setString(10, e.getFotografia());
        
        cstmt.setInt(11, e.getProducto().getIdProducto());
        cstmt.setInt(12, e.getIdArmazon());
        
        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }
    
    //Eliminacion logica
    public void delete(Armazon a) throws Exception {
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
    
    //Eliminacion fisica
    /*public void delete(int id) throws Exception {
        String sql1 = "delete from armazon where idArmazon=?";
        String sql2 = "delete from producto where idProducto=?";
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql1);
        pstmt.setInt(1, id);
        pstmt.executeUpdate();
        pstmt = conn.prepareStatement(sql2);
        pstmt.setInt(1, id);
        pstmt.executeUpdate();
        pstmt.close();
        connMySQL.close();
    }*/
    
    //metodo para obtener todos los datos
    public List<Armazon> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql = "SELECT * FROM v_armazones where estatus=1;";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();
        
        //Creamos un ArrayList object con la clase armazon
        List<Armazon> armazones = new ArrayList<>();
        
        //Funcion para llenar el ArrayList con el contenido del resulset (ocupa el fill para formato)
        while (rs.next()) {
            armazones.add(fill(rs));
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();
        
        //retornamos el Arraylist
        return armazones;
    }
    
    //Metodo que obtiene los datos del ResultSet y los retorna en un objecto de clase armazon
    private Armazon fill(ResultSet rs) throws Exception {
        
        //Creamos los objectos de las clases
        Armazon a = new Armazon();
        Producto p = new Producto();
        
        //obtenemos los datos del producto del ResultSet
        p.setIdProducto(rs.getInt("idProducto"));
        p.setCodigoBarras(rs.getString("codigoBarras"));
        p.setNombre(rs.getString("nombre"));
        p.setMarca(rs.getString("marca"));
        p.setPrecioCompra(rs.getDouble("precioCompra"));
        p.setPrecioVenta(rs.getDouble("precioVenta"));
        p.setExistencias(rs.getInt("existencias"));
        p.setEstatus(rs.getInt("estatus"));
        
        //obtenemos los datos del armazon del ResultSet
        a.setIdArmazon(rs.getInt("idArmazon"));
        a.setProducto(p);
        a.setModelo(rs.getString("modelo"));
        a.setColor(rs.getString("color"));
        a.setDimensiones(rs.getString("dimensiones"));
        a.setDescripcion(rs.getString("descripcion"));
        a.setFotografia(rs.getString("fotografia"));
        
        //retornamos el armazon (ya contiene a producto)
        return a;
    }
}
