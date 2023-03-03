package com.dtc.optik.rest;

import com.dtc.oq.core.ControllerCliente;
import com.dtc.oq.core.ControllerLogin;
import com.dtc.oq.model.Cliente;
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

@Path("cliente")
public class RESTCliente {

    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosCliente") @DefaultValue("") String datosCliente,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Cliente cli = null;
        ControllerCliente cc = new ControllerCliente();

        try {

            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }
            cli = gson.fromJson(datosCliente, Cliente.class);
            if (cli.getIdCliente() == 0) {
                cc.insert(cli);
            } else {
                cc.update(cli);
            }
            out = gson.toJson(cli);

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
        ControllerCliente cc = null;
        List<Cliente> clientes = null;

        try {
            cc = new ControllerCliente();
            clientes = cc.getAll(filtro);
            out = new Gson().toJson(clientes);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exeption\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("delete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@FormParam("datosCliente") @DefaultValue("") String datosCliente,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Cliente cli = null;
        ControllerCliente cc = new ControllerCliente();

        try {

            ControllerLogin cl = new ControllerLogin();
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }
            cli = gson.fromJson(datosCliente, Cliente.class);
            cc.delete(cli);
            out = gson.toJson(cli);

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
