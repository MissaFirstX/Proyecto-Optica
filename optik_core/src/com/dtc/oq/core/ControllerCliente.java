
package com.dtc.oq.core;

import com.dtc.oq.db.ConexionMySQL;
import com.dtc.oq.model.Cliente;
import com.dtc.oq.model.Persona;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

public class ControllerCliente {
    public int insert(Cliente c) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarCliente(?, ?, ?, ?, ?, ?, ?, "
                + // Datos Personales
                "?, ?, ?, ?, ?, ?, ?, "
                + // Datos de Seguridad
                "?, ?, ?)}";  // Valores de Retorno

        //Aquí guardaremos los ID's que se generarán:
        //Se les declara un valor -1 ya que en la base de datos un id < 0 esta fuera de rango
        int idPersonaGenerado = -1;
        int idClienteGenerado = -1;
        String numeroUnicoGenerado = "";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:        
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, c.getPersona().getNombre());
        cstmt.setString(2, c.getPersona().getApellidoPaterno());
        cstmt.setString(3, c.getPersona().getApellidoMaterno());
        cstmt.setString(4, c.getPersona().getGenero());
        cstmt.setString(5, c.getPersona().getFechaNacimiento());
        cstmt.setString(6, c.getPersona().getCalle());
        cstmt.setString(7, c.getPersona().getNumero());
        cstmt.setString(8, c.getPersona().getColonia());
        cstmt.setString(9, c.getPersona().getCp());
        cstmt.setString(10, c.getPersona().getCiudad());
        cstmt.setString(11, c.getPersona().getEstado());
        cstmt.setString(12, c.getPersona().getTelCasa());
        cstmt.setString(13, c.getPersona().getTelMovil());
        cstmt.setString(14, c.getPersona().getEmail());

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(15, Types.INTEGER);
        cstmt.registerOutParameter(16, Types.INTEGER);
        cstmt.registerOutParameter(17, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idPersonaGenerado = cstmt.getInt(15);
        idClienteGenerado = cstmt.getInt(16);
        numeroUnicoGenerado = cstmt.getString(17);

        c.setIdCliente(idClienteGenerado);
        c.getPersona().setIdPersona(idPersonaGenerado);
        c.setNumeroUnico(numeroUnicoGenerado);

        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de Cliente generado:
        return idClienteGenerado;
    }

    public void update(Cliente c) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarCliente(  ?, ?, ?, ?, ?, ?, ?, "
                + //Datos Personales
                "?, ?, ?, ?, ?, ?, ?, "
                + // Datos de Seguridad
                "?, ?)}"; // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, c.getPersona().getNombre());
        cstmt.setString(2, c.getPersona().getApellidoPaterno());
        cstmt.setString(3, c.getPersona().getApellidoMaterno());
        cstmt.setString(4, c.getPersona().getGenero());
        cstmt.setString(5, c.getPersona().getFechaNacimiento());
        cstmt.setString(6, c.getPersona().getCalle());
        cstmt.setString(7, c.getPersona().getNumero());
        cstmt.setString(8, c.getPersona().getColonia());
        cstmt.setString(9, c.getPersona().getCp());
        cstmt.setString(10, c.getPersona().getCiudad());
        cstmt.setString(11, c.getPersona().getEstado());
        cstmt.setString(12, c.getPersona().getTelCasa());
        cstmt.setString(13, c.getPersona().getTelMovil());
        cstmt.setString(14, c.getPersona().getEmail());

        cstmt.setInt(15, c.getPersona().getIdPersona());
        cstmt.setInt(16, c.getIdCliente());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public void delete(Cliente c) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call eliminarCliente(?)}";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setInt(1, c.getIdCliente());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public List<Cliente> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql = "SELECT * FROM v_clientes where estatus=1;";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Cliente> clientes = new ArrayList<>();

        while (rs.next()) {
            clientes.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return clientes;
    }

    private Cliente fill(ResultSet rs) throws Exception {
        Cliente c = new Cliente();
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

        c.setIdCliente(rs.getInt("idCliente"));
        c.setNumeroUnico(rs.getString("numeroUnico"));        
        c.setNumeroUnico(rs.getString("numeroUnico"));

        c.setPersona(p);

        return c;
    }
}
