/* global Swal, fetch */
let soluciones = [];

export function inicializarSol() {
    refreshTable();
    configureTableFilter(document.getElementById("txtSearch"), document.getElementById("tblSolucion"));
}

export function fillTable(data) {
    //Declaramos una variable donde se guardara el contenido de la tabla:
    let contenido = '';
    soluciones = data;
    //Recorrer el Arreglo
    for (let i = 0; i < data.length; i++) {
        //Vamos generando el contenido de la tabla dinamicamente:
        contenido +=
                '<tr>' +
                '<td>' + data[i].producto.nombre + '</td>' +
                '<td>' + data[i].producto.marca + '</td>' +
                '<td>' + data[i].producto.precioCompra + '</td>' +
                '<td>' + data[i].producto.precioVenta + '</td>' +
                '<td>' + data[i].producto.existencias + '</td>' +
                '<td><a href="#" onclick="cm.mostrarDetalleSolucion(' + i + ');"><i class="fas fa-pencil-alt"></i></a></td>' +
                '</tr>';
    }
    document.getElementById('tbodySolucion').innerHTML = contenido;
}

export function refreshTable() {
    let url = "../api/solucion/getAll";
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

export function mostrarDetalleSolucion(posicion) {

    let s = soluciones[posicion];
    limpiarFormularioDetalle();

    document.getElementById("txtCodigoSolucion").value = s.idSolucion;
    document.getElementById("txtCodigoProducto").value = s.producto.idProducto;
    document.getElementById("txtNombre").value = s.producto.nombre;
    document.getElementById("txtMarca").value = s.producto.marca;
    document.getElementById("txtPrecioCompra").value = s.producto.precioCompra;
    document.getElementById("txtPrecioVenta").value = s.producto.precioVenta;
    document.getElementById("txtExistencias").value = s.producto.existencias;
    document.getElementById("txtCodigoBarrasSolucion").value = s.producto.codigoBarras;

}

export function limpiarFormularioDetalle() {
    document.getElementById("txtCodigoSolucion").value = "";
    document.getElementById("txtCodigoProducto").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtMarca").value = "";
    document.getElementById("txtPrecioCompra").value = "";
    document.getElementById("txtPrecioVenta").value = "";
    document.getElementById("txtExistencias").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtCodigoBarrasSolucion").value = "";
}

//Buscar la posicion de un Accesorio
//dentro del arreglo de soluciones
//con base en el idAccesorio
function buscarPosicionPorId(id) {
    for (let i = 0;
    i < soluciones.length; i++) {
        //Comparamos si el ID del Accesorio en la posicion
        //actual, es igual al id que nos pasan como parametro:
        if (soluciones[i].idSolucion === id) {
            return i; //Si son iguales, regresamos la posicion
        }
    }
    //Si llegamos hasta aqui significa que
    //que no encontramos el ID buscado y entonces
    //devolvemos -1

    return -1;
}

export function save() {

    let datos = null;
    let params = null;

    let solucion = new Object();
    solucion.producto = new Object();

    //Revisamos si hay algun valor en la caja de texto del id del empleado:
    //El trim quita espacios a la derecha e izquierda
    if (document.getElementById("txtCodigoSolucion").value.trim().length < 1) {
        solucion.idSolucion = 0;
        solucion.producto.idProducto = 0;

    } else {
        //Si el accesorio ya tiene un id, lo tomamos para actualizar sus datos:
        solucion.idSolucion = parseInt(document.getElementById("txtCodigoSolucion").value);
        solucion.producto.idProducto = parseInt(document.getElementById("txtCodigoProducto").value);
    }

    solucion.producto.codigoBarras = document.getElementById("txtCodigoBarrasSolucion").value;
    solucion.producto.nombre = sanitizar(document.getElementById("txtNombre").value);
    solucion.producto.marca =document.getElementById("txtMarca").value;
    solucion.producto.precioCompra = parseFloat(document.getElementById("txtPrecioCompra").value);
    solucion.producto.precioVenta = parseFloat(document.getElementById("txtPrecioVenta").value);
    solucion.producto.existencias = parseInt(document.getElementById("txtExistencias").value);

    datos = {
        datosSolucion: JSON.stringify(solucion),
        token: autenticarToken()
    };

    params = new URLSearchParams(datos);

    autenticarToken();
    fetch("../api/solucion/save",
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

        document.getElementById("txtCodigoBarrasSolucion").value = data.producto.codigoBarras;
        document.getElementById("txtCodigoProducto").value = data.producto.idProducto;
        document.getElementById("txtCodigoSolucion").value = data.idSolucion;

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

    //creamos dos variables de tipo objeto
    let solucion = new Object();
    solucion.producto = new Object();

    if (document.getElementById("txtCodigoSolucion").value.trim().length < 1) {
        Swal.fire('', 'Selecciona una Solución', 'error');
    } else {
        swalWithBootstrapButtons.fire({
            title: '¿Esta Seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar!',
            cancelButtonText: 'Cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                solucion.idSolucion = parseInt(document.getElementById("txtCodigoSolucion").value);
                solucion.producto.idProducto = parseInt(document.getElementById("txtCodigoProducto").value);
                datos = {
                    datosSolucion: JSON.stringify(solucion),
                    token: autenticarToken()
                };

                params = new URLSearchParams(datos);

                autenticarToken();
                //usamos el fetch para poder encontrar la ruta del JSON de la funcion remover dentro de la pagina
                fetch("../api/solucion/remove",
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

                    document.getElementById("txtCodigoSolucion").value = data.idSolucion;


                    Swal.fire('', 'Datos de Solución eliminados correctamente', 'success');
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


function sanitizar(texto) {
    for (var i = 0; i < texto.length; i++) {
        texto = texto.replace("(", "");
        texto = texto.replace(")", "");
        texto = texto.replace(";", "");
        texto = texto.replace("'", "");
        texto = texto.replace("\"", "");
        texto = texto.replace("-", "");
        texto = texto.replace("*", "");
        texto = texto.replace("%", "");
        texto = texto.replace("<<", "");
        texto = texto.replace(">>", "");
        texto = texto.replace("=", "");

    }
    return texto;
}