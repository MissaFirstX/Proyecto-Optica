/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.oq.db;

/**
 *
 * @author Toxic
 */
public class PruebaConexion {

    public static void main(String[] args) {
        ConexionMySQL connMySQL = new ConexionMySQL();
        try {
            connMySQL.open();
            System.out.println("Ya le sabes a las conexiones");

            connMySQL.close();
            System.out.println("Adios bro");
        } catch (Exception e) {
            e.printStackTrace();
        }
        
    }

}
