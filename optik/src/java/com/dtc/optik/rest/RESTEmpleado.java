/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.optik.rest;

import com.dtc.oq.core.ControllerEmpleado;
import com.dtc.oq.core.ControllerLogin;
import com.dtc.oq.model.Empleado;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 *
 * @author Toxic
 */
@Path("empleado")
public class RESTEmpleado {

    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosEmpleado") @DefaultValue("") String datosEmpleado,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Empleado emp = null;
        ControllerEmpleado ce = new ControllerEmpleado();

        try {
            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }
            emp = gson.fromJson(datosEmpleado, Empleado.class);

            if (emp.getIdEmpleado() == 0) {
                ce.insert(emp);
            } else {
                ce.update(emp);
            }
            out = gson.toJson(emp);

        } catch (JsonParseException jpe) {

            jpe.printStackTrace();
            out = """
                    {"exeption":"Formato JSON de Datos Incorrecto"}
                  """;

        } catch (Exception e) {

            e.printStackTrace();
            out = """
                  {"exception":"%s"}                  
                  """;
            out = String.format(out, e.toString());
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@QueryParam("filtro") @DefaultValue("") String filtro) {
        String out = null;
        ControllerEmpleado ce = null;
        List<Empleado> empleados = null;

        try {
            
            ce = new ControllerEmpleado();
            empleados = ce.getAll(filtro);
            out = new Gson().toJson(empleados);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exeption\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("delete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@FormParam("datosEmpleado") @DefaultValue("") String datosCliente,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Empleado em = null;
        ControllerEmpleado ce = new ControllerEmpleado();

        try {
            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }
            em = gson.fromJson(datosCliente, Empleado.class);
            ce.delete(em);
            out = gson.toJson(em);

        } catch (JsonParseException jpe) {

            jpe.printStackTrace();
            out = """
                    {"exeption":"Formato JSON de Datos Incorrecto"}
                  """;

        } catch (Exception e) {

            e.printStackTrace();
            out = """
                  {"exception":"%s"}                  
                  """;
            out = String.format(out, e.toString());
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
