/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dtc.optik.rest;

import com.dtc.oq.core.ControllerLenteContacto;
import com.dtc.oq.core.ControllerLogin;
import com.dtc.oq.model.Lente_Contacto;
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
 * @author kenay
 */

//el rest para acceder al save dentro de la pagina
@Path("lente")
public class RESTLenteContacto {

    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosLenteContacto") @DefaultValue("") String datosLenteContacto,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Lente_Contacto lc = null; //emp
        ControllerLenteContacto clc = new ControllerLenteContacto(); //ce

        try {
            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }
            lc = gson.fromJson(datosLenteContacto, Lente_Contacto.class);
            if (lc.getIdLenteContacto() == 0) {
                clc.insert(lc);
            } else {
                clc.update(lc);
            }
            out = gson.toJson(lc);

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
        ControllerLenteContacto clc = null; //ce
        List<Lente_Contacto> lentes = null;

        try {
            clc = new ControllerLenteContacto();
            lentes = clc.getAll(filtro);
            out = new Gson().toJson(lentes);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exeption\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    //El rest que nos permite ingresar al path de remover
    @Path("remove")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response remove(@FormParam("datosLenteContacto") @DefaultValue("") String datosLenteContacto,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Lente_Contacto lc = null; //emp = lc
        ControllerLenteContacto clc = new ControllerLenteContacto(); //ce = clc

        try {
            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }
            lc = gson.fromJson(datosLenteContacto, Lente_Contacto.class);
            clc.delete(lc);
            out = gson.toJson(lc);
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
