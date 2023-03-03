/* global Swal, fetch */

let accesorios = [];

export function inicializarAccesorio() {
    refreshTable();
    configureTableFilter(document.getElementById("txtSearch"), document.getElementById("tblAccesorios"));
}

export function refreshTable() {
    let url = "../api/accesorio/getAll";
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
    accesorios = data;
    //Recorrer el Arreglo
    for (let i = 0; i < data.length; i++) {
        //Vamos generando el contenido de la tabla dinamicamente:
        contenido += '<tr>' +
                '<td>' + data[i].producto.nombre + ' ' + '</td>' +
                '<td>' + data[i].producto.marca + ' ' + '</td>' +
                '<td>' + data[i].producto.precioCompra + '</td>' +
                '<td>' + data[i].producto.precioVenta + '</td>' +
                '<td>' + data[i].producto.existencias + '</td>' +
                '<td><a href="#" onclick="cm.mostrarDetalleAccesorio(' + i + ');"><i class="fas fa-pencil-alt"></i></a></td>' +
                '</tr>';
    }
    document.getElementById('tbodyAccesorio').innerHTML = contenido;
}


export function mostrarDetalleAccesorio(posicion) {

    let a = accesorios[posicion];
    //Limpiamos formulario

    limpiarFormularioDetalle();

    //Llenamos el formulario con los datos del accesorio

    document.getElementById("txtCodigoAccesorio").value = a.idAccesorio;
    document.getElementById("txtCodigoProducto").value = a.producto.idProducto;
    document.getElementById("txtNombreAc").value = a.producto.nombre;
    document.getElementById("txtMarcaAc").value = a.producto.marca;
    document.getElementById("txtPrecioCompraAc").value = a.producto.precioCompra;
    document.getElementById("txtPrecioVentaAc").value = a.producto.precioVenta;
    document.getElementById("txtExistenciasAc").value = a.producto.existencias;

}


export function limpiarFormularioDetalle() {
    document.getElementById("txtCodigoAccesorio").value = null;
    document.getElementById("txtCodigoProducto").value = null;
    document.getElementById("txtNombreAc").value = null;
    document.getElementById("txtMarcaAc").value = null;
    document.getElementById("txtPrecioCompraAc").value = null;
    document.getElementById("txtPrecioVentaAc").value = null;
    document.getElementById("txtExistenciasAc").value = null;
}

//Buscar la posicion de un Accesorio
//dentro del arreglo de accesorios
//con base en el idAccesorio
function buscarPosicionPorId(id) {
    for (let i = 0;
    i < accesorios.length; i++) {
        //Comparamos si el ID del Accesorio en la posicion
        //actual, es igual al id que nos pasan como parametro:
        if (accesorios[i].idAccesorio === id) {
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
    let accesorios = new Object();
    accesorios.producto = new Object();

    if (document.getElementById("txtCodigoAccesorio").value.trim().length < 1) {
        accesorios.producto.idProducto = 0;
        accesorios.idAccesorio = 0;

    } else {
        accesorios.producto.idProducto = parseInt(document.getElementById("txtCodigoProducto").value);
        accesorios.idAccesorio = parseInt(document.getElementById("txtCodigoAccesorio").value);
    }

    accesorios.producto.codigoBarras = "";
    accesorios.producto.nombre = sanitizar(document.getElementById("txtNombreAc").value);
    accesorios.producto.marca = sanitizar(document.getElementById("txtMarcaAc").value);
    accesorios.producto.precioCompra = sanitizar(document.getElementById("txtPrecioCompraAc").value);
    accesorios.producto.precioVenta = sanitizar(document.getElementById("txtPrecioVentaAc").value);
    accesorios.producto.existencias = sanitizar(document.getElementById("txtExistenciasAc").value);

    datos = {
        datosAccesorio: JSON.stringify(accesorios),
        token : autenticarToken()
    };

    params = new URLSearchParams(datos);

    
    fetch("../api/accesorio/save",
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

        document.getElementById("txtCodigoAccesorio").value = data.idAccesorio;
        document.getElementById("txtCodigoProducto").value = data.producto.idProducto;


        Swal.fire('', 'Datos del Accesorio actualizados correctamente', 'success');

        refreshTable();
        limpiarFormularioDetalle();

//        alert(JSON.stringify(data));
    });
}

//Metodo para Eliminar
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

    let accesorios = new Object();
    accesorios.producto = new Object();

    if (document.getElementById("txtCodigoProducto").value.trim().length < 1) {
        Swal.fire('', 'Selecciona un Accesorio', 'error');
    } else {
        swalWithBootstrapButtons.fire({
            title: '¿Esta Seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                accesorios.producto.idProducto = parseInt(document.getElementById("txtCodigoProducto").value);

                datos = {
                    datosAccesorio: JSON.stringify(accesorios),
                    token : autenticarToken()
                };

                params = new URLSearchParams(datos);

                autenticarToken();
                fetch("../api/accesorio/remove",
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

                    document.getElementById("txtCodigoProducto").value = data.idAccesorio;

                    Swal.fire('', 'Datos del Accesorio eliminado correctamente', 'success');
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

export function limpiar_y_mostrarDetalle() {
    limpiarFormularioDetalle();
    setDetalleVisible(true);
}