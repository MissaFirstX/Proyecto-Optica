//Creamos el arreglo de empleados:
let clientes = [];


export function inicializarCliente() {
    refreshTable();
    configureTableFilter(document.getElementById("txtSearch"),document.getElementById("tblClientes"));
}

/**
 * Llena una tabla a partir de un Arreglo JSON.
 */

export function refreshTable() {
    let url = "../api/cliente/getAll";
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)

            {
                if (data.exception != null) {
                    Swal.fire('', 'Error interno del servidor, Intente de nuevo más tarde.', 'error');
                    return;
                }

                if (data.error != null) {
                    Swal.fire('', data.error, 'warning');
                }

                if (data.errorsec != null) {
                    Swal.fire('', data.errorsec, 'error');
                    window.location.replace('../index.html');
                    return;
                }

                fillTable(data);
            });
}

export function fillTable(data) {

    //Declaramos una variable donde se guardara el contenido de la tabla:
    let contenido = '';
    clientes = data;
    //Recorrer el Arreglo
    for (let i = 0; i < data.length; i++) {
        //Vamos generando el contenido de la tabla dinamicamente:
        contenido += '<tr>' +
                '<td>' +
                data[i].persona.nombre + ' ' +
                data[i].persona.apellidoPaterno + ' ' +
                data[i].persona.apellidoMaterno +
                '</td>' +
                '<td>' + data[i].persona.email + '</td>' +
                '<td>' + data[i].persona.telCasa + '</td>' +
                '<td>' + data[i].persona.telMovil + '</td>' +
                '<td><a href="#" onclick="cm.mostrarDetalleCliente(' + i + ');"><i class="fas fa-pencil-alt"></i></a></td>' +
                '</tr>';
    }
    document.getElementById('tbodyClientes').innerHTML = contenido;
}

export function mostrarDetalleCliente(posicion) {

    let c = clientes[posicion];
    limpiarFormularioDetalle();

    //Llenamos el formulario con los datos del empleado
    //Datos personales
    document.getElementById("txtNombreC").value = c.persona.nombre;
    document.getElementById("txtApellidoPaternoC").value = c.persona.apellidoPaterno;
    document.getElementById("txtApellidoMaternoC").value = c.persona.apellidoMaterno;
    document.getElementById("txtGeneroC").value = c.persona.genero;
    document.getElementById("txtFechaNacimientoC").value = c.persona.fechaNacimiento;

    //Dirección
    document.getElementById("txtCalleC").value = c.persona.calle;
    document.getElementById("txtColoniaC").value = c.persona.colonia;
    document.getElementById("txtNumeroDomicilioC").value = c.persona.numero;
    document.getElementById("txtCodigoPostalC").value = c.persona.cp;
    document.getElementById("txtCiudadC").value = c.persona.ciudad;
    document.getElementById("txtEstadoC").value = c.persona.estado;

    //Datos contacto
    document.getElementById("txtEmailCliente").value = c.persona.email;
    document.getElementById("txtTelefonoCasaC").value = c.persona.telCasa;
    document.getElementById("txtTelefonoMovilC").value = c.persona.telMovil;

    //Datos seguridad
    document.getElementById("codigoCliente").value = c.numeroUnico;
    document.getElementById("idCliente").value = c.idCliente;
    document.getElementById("idPersona").value = c.persona.idPersona;

}

export function limpiarFormularioDetalle() {
    //Datos personales
    document.getElementById("txtNombreC").value = "";
    document.getElementById("txtApellidoPaternoC").value = "";
    document.getElementById("txtApellidoMaternoC").value = "";
    document.getElementById("txtGeneroC").value = "";
    document.getElementById("txtFechaNacimientoC").value = "";

    //Dirección
    document.getElementById("txtCalleC").value = "";
    document.getElementById("txtColoniaC").value = "";
    document.getElementById("txtCalleC").value = "";
    document.getElementById("txtNumeroDomicilioC").value = "";
    document.getElementById("txtCodigoPostalC").value = "";
    document.getElementById("txtCiudadC").value = "";
    document.getElementById("txtEstadoC").value = "";

    //Datos contacto
    document.getElementById("txtEmailCliente").value = "";
    document.getElementById("txtTelefonoMovilC").value = "";
    document.getElementById("txtTelefonoCasaC").value = "";

    //Datos seguridad
    document.getElementById("codigoCliente").value = "";
    document.getElementById("idCliente").value = "";
    document.getElementById("idPersona").value = "";
}


//Buscar la posicion de un Empleado dentro del arreglo de empleado con base en el id
function buscarPosicionPorId(id) {
    for (let i = 0;
    i < clientes.length; i++) {
        //Comparamos si el ID del Empleado en la posicion
        //actual, es igual al id que nos pasan como parametro:
        if (clientes[i].id_cliente === id) {
            return i; //Si son iguales, regresamos la posicion
        }
    }
    //Si llegamos hasta aqui significa que
    //que no encontramos el ID buscado y entonces
    //devolvemos -1

    return -1;
}


//Guardar los datos de un empleado (insert/update)
export function save() {
    let datos = null;
    let params = null;

    //Definimos los atributos y valores del empleado
    let cliente = new Object();
    cliente.persona = new Object();

    //Revisamos si hay algun valor en la caja de texto del id del empleado:
    //El trim quita espacios a la derecha e izquierda
    if (document.getElementById("idCliente").value.trim().length < 1) {
        cliente.idCliente = 0;
        cliente.persona.idPersona = 0;
    } else {
        //Si el accesorio ya tiene un id, lo tomamos para actualizar sus datos:
        cliente.idCliente = parseInt(document.getElementById("idCliente").value);
        cliente.persona.idPersona = parseInt(document.getElementById("idPersona").value);
    }

    //Persona
    cliente.persona.nombre = document.getElementById("txtNombreC").value;
    cliente.persona.apellidoPaterno = document.getElementById("txtApellidoPaternoC").value;
    cliente.persona.apellidoMaterno = document.getElementById("txtApellidoMaternoC").value;
    cliente.persona.genero = document.getElementById("txtGeneroC").value;
    cliente.persona.fechaNacimiento = document.getElementById("txtFechaNacimientoC").value;
    cliente.persona.calle = document.getElementById("txtCalleC").value;
    cliente.persona.numero = document.getElementById("txtNumeroDomicilioC").value;
    cliente.persona.colonia = document.getElementById("txtColoniaC").value;
    cliente.persona.cp = document.getElementById("txtCodigoPostalC").value;
    cliente.persona.ciudad = document.getElementById("txtCiudadC").value;
    cliente.persona.estado = document.getElementById("txtEstadoC").value;
    cliente.persona.telCasa = document.getElementById("txtTelefonoCasaC").value;
    cliente.persona.telMovil = document.getElementById("txtTelefonoMovilC").value;
    cliente.persona.email = document.getElementById("txtEmailCliente").value;

    cliente.numeroUnico = document.getElementById("codigoCliente").value;

    datos = {
        datosCliente: JSON.stringify(cliente)
    };

    params = new URLSearchParams(datos);

    autenticarToken();
    fetch("../api/cliente/save",
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            }).then(response => {
        return response.json();
    }).then(function (data) {

        if (data.exception != null) {
            Swal.fire('', 'Error interno del servidor', 'error');
            return;
        }

        if (data.error != null) {
            Swal.fire('', data.error, 'warning');
            return;
        }

        if (data.errorperm != null) {
            Swal.fire('', 'No tiene permiso para esta operación', 'warning');
            return;
        }

        document.getElementById("codigoCliente").value = data.numeroUnico;
        document.getElementById("idPersona").value = data.persona.idPersona;
        document.getElementById("idCliente").value = data.idCliente;

        mandarConfirmacionGuardar();
        refreshTable();
        limpiarFormularioDetalle();
    });
}

export function remove() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger me-4'
        },
        buttonsStyling: false
    });
    
    let datos = null;
    let params = null;
    
    let cliente = new Object();
    
    //verificamos que se haya seleccionado un armazon a eliminar
    if (document.getElementById("idCliente").value.trim().length < 1) {
        Swal.fire('', 'Selecciona un cliente', 'error');
    } 
    //en casode que se haya seleccionado mostraremos el menu de confirmacion
    else {
        swalWithBootstrapButtons.fire({
        title: '¿Esta Seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar!',
        cancelButtonText: 'Cancelar!',
        reverseButtons: true
    }).then((result) => {
        //si se confirma, entonces...
        if (result.isConfirmed) {
        cliente.idCliente = parseInt(document.getElementById("idCliente").value);
            
        datos = {
        datosCliente: JSON.stringify(cliente)
    };

    params = new URLSearchParams(datos);

    autenticarToken();
    fetch("../api/cliente/delete",
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            }).then(response => {
        return response.json();
    }).then(function (data) {

        if (data.exception != null) {
            Swal.fire('', 'Error interno del servidor', 'error');
            return;
        }

        if (data.error != null) {
            Swal.fire('', data.error, 'warning');
            return;
        }

        if (data.errorperm != null) {
            Swal.fire('', 'No tiene permiso para esta operación', 'warning');
            return;
        }

        document.getElementById("idCliente").value = data.idCliente;

        Swal.fire('', 'Datos del cliente eliminados correctamente', 'success');
        refreshTable();
        limpiarFormularioDetalle();
    });
            
        } else if (
                /*Si se cancela entonces...*/
                result.dismiss === Swal.DismissReason.cancel
                ) {
            swalWithBootstrapButtons.fire(
                    'Cancelado',
                    '',
                    'error'
                    );
        }
    });
    }
    
}

