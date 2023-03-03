/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.oq.model;

import java.util.List;

/**
 *
 * @author cco3
 */
public class Detalle_VentaP {

    private Venta venta;
    private List<Venta_Producto> lvp;

    public Detalle_VentaP() {
    }

    public Detalle_VentaP(Venta venta, List<Venta_Producto> lvp) {
        this.venta = venta;
        this.lvp = lvp;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    public List<Venta_Producto> getLvp() {
        return lvp;
    }

    public void setLvp(List<Venta_Producto> lvp) {
        this.lvp = lvp;
    }

    @Override
    public String toString() {
        String mensaje = "";

        for (int i = 0; i < lvp.size(); i++) {
            mensaje += lvp.get(i);
        }

        return "Detalle_VentaP{" + "venta=" + venta.toString() + ", lvp=" + mensaje + '}';
    }

}
