/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.oq.core;

import com.dtc.oq.db.ConexionMySQL;
import com.dtc.oq.model.Detalle_VentaP;
import com.dtc.oq.model.Lente_Contacto;
import com.dtc.oq.model.Venta_Producto;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author cco3
 */
public class ControllerVentaP {

    public boolean generarVenta(Detalle_VentaP dvp) {

        boolean r = false;
        ConexionMySQL conMysql = new ConexionMySQL();
        Connection conn = conMysql.open();
        Statement stmt = null;
        ResultSet rs = null;

        try {

            conn.setAutoCommit(false);
            String query1 = "INSERT INTO venta (idEmpleado,clave) VALUE (" + dvp.getVenta().getEmpleado().getIdEmpleado() + ",'" + dvp.getVenta().getClave() + "');";
            stmt = conn.createStatement();
            stmt.execute(query1);
            rs = stmt.executeQuery("SELECT LAST_INSERT_ID();");

            if (rs.next()) {
                dvp.getVenta().setIdVenta(rs.getInt(1));
            }

            for (int i = 0; i < dvp.getLvp().size(); i++) {
                String query2 = "INSERT INTO venta_producto VALUES(" + dvp.getVenta().getIdVenta() + "," + dvp.getLvp().get(i).getProducto().getIdProducto()
                        + "," + dvp.getLvp().get(i).getCantidad() + "," + dvp.getLvp().get(i).getPrecioUnitario() + "," + dvp.getLvp().get(i).getDescuento()+");";
                String query3 = "UPDATE producto SET existencias = existencias - "+dvp.getLvp().get(i).getCantidad()+" where idProducto = "+dvp.getLvp().get(i).getProducto().getIdProducto();
                stmt.execute(query2);
                stmt.execute(query3);
            }

            conn.commit();
            conn.setAutoCommit(true);
            rs.close();
            stmt.close();
            conn.close();
            conMysql.close();
            r = true;

        } catch (SQLException ex) {
            Logger.getLogger(ControllerVentaP.class.getName()).log(Level.SEVERE, null, ex);

            try {
                conn.rollback();
                conn.setAutoCommit(true);
                conn.close();
                conMysql.close();

                r = false;

            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVentaP.class.getName()).log(Level.SEVERE, null, ex1);
            }
            r = false;
        }

        return r;
    }

}
