package com.oq.model;

/**
 *
 * @author LiveGrios
 */
public class Empleado
{
    int idEmpleado;
    String numeroUnico;
    Usuario usuario;
    int estatus;
    Persona persona;
    
    public int getIdEmpleado()
    {
        return idEmpleado;
    }

    public void setIdEmpleado(int idEmpleado)
    {
        this.idEmpleado = idEmpleado;
    }

    public String getNumeroUnico()
    {
        return numeroUnico;
    }

    public void setNumeroUnico(String numeroUnico)
    {
        this.numeroUnico = numeroUnico;
    }

    public Usuario getUsuario()
    {
        return usuario;
    }

    public void setUsuario(Usuario usuario)
    {
        this.usuario = usuario;
    }

    public int getEstatus()
    {
        return estatus;
    }

    public void setEstatus(int estatus)
    {
        this.estatus = estatus;
    }

    public Persona getPersona()
    {
        return persona;
    }

    public void setPersona(Persona persona)
    {
        this.persona = persona;
    }
    
    
}
