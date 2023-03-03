package com.dtc.optik.rest;

import com.dtc.oq.core.ControllerArmazon;
import com.dtc.oq.core.ControllerLogin;
import com.dtc.oq.model.Armazon;
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

@Path("armazon")
public class RESTArmazon {

    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosArmazon") @DefaultValue("") String datosArmazon,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Armazon arm = null;
        ControllerArmazon ca = new ControllerArmazon();

        try {

            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }

            arm = gson.fromJson(datosArmazon, Armazon.class);
            if (arm.getIdArmazon() == 0) {
                ca.insert(arm);
            } else {
                ca.update(arm);
            }
            out = gson.toJson(arm);

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
        ControllerArmazon ca = null;
        List<Armazon> armazones = null;

        try {
            ca = new ControllerArmazon();
            armazones = ca.getAll(filtro);
            out = new Gson().toJson(armazones);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exeption\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("remove")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response remove(@FormParam("datosArmazon") @DefaultValue("") String datosArmazon,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Armazon arm = null;
        ControllerArmazon ca = new ControllerArmazon();

        try {

            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }

            arm = gson.fromJson(datosArmazon, Armazon.class);
            ca.delete(arm);
            out = gson.toJson(arm);
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
