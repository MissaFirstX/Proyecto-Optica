/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.optik.rest;

import com.dtc.oq.core.ControllerLogin;
import com.dtc.oq.model.Empleado;
import com.dtc.oq.model.Usuario;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 *
 * @author Toxic
 */
@Path("login")
public class RESTLogin extends Application {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("login")

    public Response login(@QueryParam("usuario") @DefaultValue("") String usuario,
            @QueryParam("contrasenia") @DefaultValue("") String contrasenia) throws Exception {

        String out = null;
        Empleado emp = null;
        ControllerLogin cl = new ControllerLogin();

        try {

            emp = cl.login(usuario, contrasenia);
            String token = cl.setToken();

            if (emp != null) {

                emp.getUsuario().setLastToken(token);
                cl.guardarToken(emp);
                System.out.println(emp.getUsuario().getLastToken());
                
                if (cl.validarToken(emp.getUsuario().getLastToken())) {
                    out = new Gson().toJson(emp);
                }

            } else {
                out = """
                      {"error":"Datos incorrectos"}
                      
                      """;
            }

        } catch (Exception e) {

            e.printStackTrace();
            out = """
                  {"exception":"%s"}
                  
                  """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("out")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response logOut(@FormParam("user") @DefaultValue("") String e) throws Exception {
        String out = null;
        ControllerLogin cl = null;
        Gson gson = new Gson();
        Usuario u = null;
        try {
            cl = new ControllerLogin();
            u = gson.fromJson(e, Usuario.class);
            System.out.println(u);

            if (cl.eliminarToken(u)) {
                out = """
                        {"ok":"Eliminación de Token correcta"}
                      """;
            } else {
                out = """
                        {"error":"Eliminación de Token no realizada"}
                      """;
            }
        } catch (JsonParseException jpe) {
            out = """
                        {"error":"Formato de datos no valido."}
                      """;
            jpe.printStackTrace();
        } catch (Exception ex) {
            out = """
                        {"error":"Acceso no concedido."}
                      """;
            ex.printStackTrace();
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}
