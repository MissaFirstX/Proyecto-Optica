/* global Swal, fetch */

//Creamos el arreglo de empleados:
let empleados = [];


export function inicializarEmpleado() {
    refreshTable();
    configureTableFilter(document.getElementById("txtSearch"), document.getElementById("tblEmpleados"));
}

//Verificamos que el correo sea valido
export function validarCorreo() {
    let email = document.getElementById("txtEmailEmpleado").value;
    let validacion = false;

    if (/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email)) {
        validacion = true;
    } else {
        campoIncorrecto("El email no es valido");
    }
    return validacion;
}

//Confirmamos que la contraseña sea igual a la confirmación de contraseña
export function verificarContraseña() {
    let contrasenia = document.getElementById("txtContraseña").value;
    let confirmacion = document.getElementById("txtConfirmarContraseña").value;
    let validacion = false;

    if (contrasenia === confirmacion) {
        validacion = true;
    } else {
        campoIncorrecto("Las contraseñas no coinciden");
    }

    return validacion;
}

//Verificamos que los teléfonos sean validos
export function verificarTelCasa() {
    let tel = document.getElementById("txtTelefonoCasa").value;
    let validacion = false;

    if (/^\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/.test(tel)) {
        validacion = true;
    }
    if (validacion === false) {
        campoIncorrecto("El teléfono de casa es incorrecto");
    }
    return validacion;
}

export function verificarTelMovil() {
    let tel = document.getElementById("txtTelefonoMovil").value;
    let validacion = false;

    if (/^\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/.test(tel)) {
        validacion = true;
    }
    if (validacion === false) {
        campoIncorrecto("El teléfono móvil es incorrecto");
    }
    return validacion;
}

/**
 * Llena una tabla a partir de un Arreglo JSON.
 */

export function refreshTable() {
    let url = "../api/empleado/getAll";
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
    empleados = data;
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
                '<td><a href="#" onclick="cm.mostrarDetalleEmpleado(' + i + ');"><i class="fas fa-pencil-alt"></i></a></td>' +
                '</tr>';
    }
    document.getElementById('tbodyEmpleados').innerHTML = contenido;
}

export function mostrarDetalleEmpleado(posicion) {

    let e = empleados[posicion];
    limpiarFormularioDetalle();

    //Llenamos el formulario con los datos del empleado
    //Datos personales
    document.getElementById("txtNombreE").value = e.persona.nombre;
    document.getElementById("txtApellidoPaternoE").value = e.persona.apellidoPaterno;
    document.getElementById("txtApellidoMaternoE").value = e.persona.apellidoMaterno;
    document.getElementById("txtGenero").value = e.persona.genero;
    document.getElementById("txtFechaNacimiento").value = e.persona.fechaNacimiento;

    //Dirección
    document.getElementById("txtCalle").value = e.persona.calle;
    document.getElementById("txtColonia").value = e.persona.colonia;
    document.getElementById("txtNumeroDomicilio").value = e.persona.numero;
    document.getElementById("txtCodigoPostal").value = e.persona.cp;
    document.getElementById("txtCiudad").value = e.persona.ciudad;
    document.getElementById("txtEstado").value = e.persona.estado;

    //Datos contacto
    document.getElementById("txtEmailEmpleado").value = e.persona.email;
    document.getElementById("txtTelefonoCasa").value = e.persona.telCasa;
    document.getElementById("txtTelefonoMovil").value = e.persona.telMovil;

    //Datos seguridad
    document.getElementById("codigoEmpleado").value = e.numeroUnico;
    document.getElementById("idEmpleado").value = e.idEmpleado;
    document.getElementById("idPersona").value = e.persona.idPersona;
    document.getElementById("idUsuario").value = e.usuario.idUsuario;
    document.getElementById("txtUsuario").value = e.usuario.nombre;
    document.getElementById("txtContraseña").value = e.usuario.contrasenia;
    document.getElementById("txtConfirmarContraseña").value = e.usuario.contrasenia;
    document.getElementById("txtRol").value = e.usuario.rol;

}

export function limpiarFormularioDetalle() {
    //Datos personales
    document.getElementById("txtNombreE").value = "";
    document.getElementById("txtApellidoPaternoE").value = "";
    document.getElementById("txtApellidoMaternoE").value = "";
    document.getElementById("txtGenero").value = "";
    document.getElementById("txtFechaNacimiento").value = "";

    //Dirección
    document.getElementById("txtCalle").value = "";
    document.getElementById("txtColonia").value = "";
    document.getElementById("txtCalle").value = "";
    document.getElementById("txtNumeroDomicilio").value = "";
    document.getElementById("txtCodigoPostal").value = "";
    document.getElementById("txtCiudad").value = "";
    document.getElementById("txtEstado").value = "";

    //Datos contacto
    document.getElementById("txtEmailEmpleado").value = "";
    document.getElementById("txtTelefonoMovil").value = "";
    document.getElementById("txtTelefonoCasa").value = "";

    //Datos seguridad
    document.getElementById("codigoEmpleado").value = "";
    document.getElementById("idEmpleado").value = "";
    document.getElementById("idPersona").value = "";
    document.getElementById("idUsuario").value = "";
    document.getElementById("txtUsuario").value = "";
    document.getElementById("txtContraseña").value = "";
    document.getElementById("txtConfirmarContraseña").value = "";
    document.getElementById("txtRol").value = "default";
}


//Buscar la posicion de un Empleado dentro del arreglo de empleado con base en el id
function buscarPosicionPorId(id) {
    for (let i = 0;
    i < empleados.length; i++) {
        //Comparamos si el ID del Empleado en la posicion
        //actual, es igual al id que nos pasan como parametro:
        if (empleados[i].id_empleado === id) {
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
    let empleado = new Object();
    empleado.usuario = new Object();
    empleado.persona = new Object();

    //Revisamos si hay algun valor en la caja de texto del id del empleado:
    //El trim quita espacios a la derecha e izquierda
    if (document.getElementById("idEmpleado").value.trim().length < 1) {
        empleado.idEmpleado = 0;
        empleado.persona.idPersona = 0;
        empleado.usuario.idUsuario = 0;
    } else {
        //Si el accesorio ya tiene un id, lo tomamos para actualizar sus datos:
        empleado.idEmpleado = parseInt(document.getElementById("idEmpleado").value);
        empleado.persona.idPersona = parseInt(document.getElementById("idPersona").value);
        empleado.usuario.idUsuario = parseInt(document.getElementById("idUsuario").value);
    }

    //Persona
    empleado.persona.nombre = document.getElementById("txtNombreE").value;
    empleado.persona.apellidoPaterno = document.getElementById("txtApellidoPaternoE").value;
    empleado.persona.apellidoMaterno = document.getElementById("txtApellidoMaternoE").value;
    empleado.persona.genero = document.getElementById("txtGenero").value;
    empleado.persona.fechaNacimiento = document.getElementById("txtFechaNacimiento").value;
    empleado.persona.calle = document.getElementById("txtCalle").value;
    empleado.persona.numero = document.getElementById("txtNumeroDomicilio").value;
    empleado.persona.colonia = document.getElementById("txtColonia").value;
    empleado.persona.cp = document.getElementById("txtCodigoPostal").value;
    empleado.persona.ciudad = document.getElementById("txtCiudad").value;
    empleado.persona.estado = document.getElementById("txtEstado").value;
    empleado.persona.telCasa = document.getElementById("txtTelefonoCasa").value;
    empleado.persona.telMovil = document.getElementById("txtTelefonoMovil").value;
    empleado.persona.email = document.getElementById("txtEmailEmpleado").value;

    //Usuario    
    empleado.usuario.nombre = document.getElementById("txtUsuario").value;
    empleado.usuario.contrasenia = encriptar(document.getElementById("txtContraseña").value);
    empleado.usuario.rol = document.getElementById("txtRol").value;

    //Empleado
    empleado.numeroUnico = document.getElementById("codigoEmpleado").value;

    datos = {
        datosEmpleado: JSON.stringify(empleado),
        token: autenticarToken()
    };

    params = new URLSearchParams(datos);

    autenticarToken();
    fetch("../api/empleado/save",
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

        document.getElementById("codigoEmpleado").value = data.numeroUnico;
        document.getElementById("idPersona").value = data.persona.idPersona;
        document.getElementById("idEmpleado").value = data.idEmpleado;
        document.getElementById("idUsuario").value = data.usuario.idUsuario;


        mandarConfirmacionGuardar();
        refreshTable();
        limpiarFormularioDetalle();
    });
}

//Eliminar un empleado
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

    let empleado = new Object();

    //verificamos que se haya seleccionado un armazon a eliminar
    if (document.getElementById("idEmpleado").value.trim().length < 1) {
        Swal.fire('', 'Selecciona un empleado', 'error');
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
                empleado.idEmpleado = parseInt(document.getElementById("idEmpleado").value);

                datos = {
                    datosEmpleado: JSON.stringify(empleado),
                    token: autenticarToken()
                };

                params = new URLSearchParams(datos);

                autenticarToken();
                fetch("../api/empleado/delete",
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

                    document.getElementById("idEmpleado").value = data.idEmpleado;

                    Swal.fire('', 'Datos del empleado eliminados correctamente', 'success');
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


