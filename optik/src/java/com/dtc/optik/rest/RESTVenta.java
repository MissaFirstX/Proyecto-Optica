package com.dtc.optik.rest;

import com.dtc.oq.core.ControllerLogin;
import com.dtc.oq.core.ControllerVentaP;
import com.dtc.oq.model.Detalle_VentaP;
import com.dtc.oq.model.Venta_Producto;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 *
 * @author cco3
 */
@Path("venta")
public class RESTVenta {

    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosVenta") @DefaultValue("") String datos,
            @FormParam("token") @DefaultValue("") String token) {
        String out = null;
        Gson gson = new Gson();
        Detalle_VentaP d = null;
        ControllerVentaP cv = new ControllerVentaP();

        try {

            ControllerLogin cl = new ControllerLogin();
            
            if (!cl.validarToken(token)) {
                out = "{\"error\":\"Token inválido\"}";
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }
            
            d = gson.fromJson(datos, Detalle_VentaP.class);
            
            cv.generarVenta(d);
            
            out = gson.toJson(d);

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
