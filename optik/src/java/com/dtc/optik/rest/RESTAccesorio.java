/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.optik.rest;

import com.dtc.oq.core.ControllerAccesorio;
import com.dtc.oq.core.ControllerLogin;
import com.dtc.oq.model.Accesorio;
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
 * @author axelt
 */
@Path("accesorio")
public class RESTAccesorio {

    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosAccesorio") @DefaultValue("") String datosAccesorio,
            @FormParam("token") @DefaultValue("") String token) {
        System.out.println(datosAccesorio);
        String out = null;
        Gson gson = new Gson();
        Accesorio ac = null;
        ControllerAccesorio ca = new ControllerAccesorio();

        try {

            ac = gson.fromJson(datosAccesorio, Accesorio.class);
            if (ac.getIdAccesorio() == 0) {
                ca.insert(ac);
            } else {
                ca.update(ac);
            }
            out = gson.toJson(ac);
            //out="{\"result\":\"OK\"}";

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
        ControllerAccesorio acce = null;
        List<Accesorio> accesorio = null;

        try {
            acce = new ControllerAccesorio();
            accesorio = acce.getAll(filtro);
            out = new Gson().toJson(accesorio);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exeption\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("remove")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response remove(@FormParam("datosAccesorio") @DefaultValue("") String datosAccesorio,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Accesorio ac = null;
        ControllerAccesorio acce = new ControllerAccesorio();

        try {
            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }

            ac = gson.fromJson(datosAccesorio, Accesorio.class);
            acce.delete(ac);
            out = gson.toJson(ac);
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
