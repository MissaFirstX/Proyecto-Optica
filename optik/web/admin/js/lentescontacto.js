//Creamos el arreglo de Lentes de contacto:
let lentes = [];

//inicializamos la tabla con ls datos de los lentes de contacto previamente guardados
export function inicializarLentesConct()
{
    refreshTable();
    configureTableFilter(document.getElementById("txtSearch"), document.getElementById("tblLentesC"));
}
/**
 * Llena una tabla a partir de un Arreglo JSON.
 */
export function refreshTable() {
    let url = "../api/lente/getAll";
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

export function fillTable(data)
{
    //Declaramos una variable donde se guardara el contenido de la tabla:
    let contenido = '';
    lentes = data;
    //Recorrer el Arreglo
    for (let i = 0; i < data.length; i++)
    {
        //Vamos generando el contenido de la tabla dinamicamente:
        contenido += '<tr>' +
                '<td>' + data[i].producto.nombre + '</td>' +
                '<td>' + data[i].producto.marca + '</td>' +
                '<td>' + data[i].producto.precioCompra + '</td>' +
                '<td>' + data[i].producto.precioVenta + '</td>' +
                '<td>' + data[i].producto.existencias + '</td>' +
                '<td><a href="#" onclick="cm.mostrarDetalleLente(' + i + ');"><i class="fas fa-pencil-alt"></i></a></td>' +
                '</tr>';
    }
    document.getElementById('tbodyLentesC').innerHTML = contenido;
}


export function mostrarDetalleLente(posicion)
{
    let l = lentes[posicion];
    limpiarFormularioDetalle();

    //Llenamos el formulario con los datos de los lentes de contacto

    //Acerca de lentes de contacto
    document.getElementById("txtNombre").value = l.producto.nombre;
    document.getElementById("txtMarca").value = l.producto.marca;
    document.getElementById("txtQueratometria").value = l.keratometria;
    document.getElementById("txtExistenciasL").value = l.producto.existencias;

    //Precios,Compras y Ventas
    document.getElementById("txtPrecioCompraL").value = l.producto.precioCompra;
    document.getElementById("txtPrecioVentaL").value = l.producto.precioVenta;

    //ID'S Y CODIGO BARRAS
    document.getElementById("txtCodigoBarrasL").value = l.producto.codigoBarras;
    document.getElementById("idLenteContacto").value = l.idLenteContacto;
    document.getElementById("idProducto").value = l.producto.idProducto;

    //Multimedia
    //document.getElementById("imgLente");
}

export function limpiarFormularioDetalle()
{
    //quitamos el contenido de los campos
    document.getElementById("idLenteContacto").value = "";
    document.getElementById("idProducto").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtMarca").value = "";
    document.getElementById("txtQueratometria").value = "";
    document.getElementById("txtPrecioCompraL").value = "";
    document.getElementById("txtPrecioVentaL").value = "";
    document.getElementById("txtExistenciasL").value = "";
    document.getElementById("txtCodigoBarrasL").value = "";
}
//Buscar la posicion de lente de contacto dentro del arreglo de lentes de contacto con base en el id
function buscarPosicionPorId(id)
{
    for (let i = 0;
    i < lentes.length; i++)
    {
        //Comparamos si el ID del lente de contacto en la posicion
        //actual, es igual al id que nos pasan como parametro:
        if (lentes[i].id_lentes_contacto === id) {
            return i; //Si son iguales, regresamos la posicion
        }
    }
    //Si llegamos hasta aqui significa que
    //que no encontramos el ID buscado y entonces
    //devolvemos -1

    return -1;
}
//Con este metodo guardamos los datos de un lente de contacto (insert/update)
export function save()
{
    let datos = null;
    let params = null;



    //Definimos los atributos y valores de los lentes de contacto
    //creamos dos objetos para poder guardar los datos
    let lente = new Object();
    lente.producto = new Object();


    //Revisamos si hay algun valor en la caja de texto del id de los lentes de contacto:
    //El trim nos ayuda para quitar espacios a la derecha e izquierda
    if (document.getElementById("idLenteContacto").value.trim().length < 1) {
        lente.idLenteContacto = 0;
        lente.producto.idProducto = 0;
    } else {
        //Si el lente ya cuenta con un id, lo tomamos para actualizar sus datos:
        lente.idLenteContacto = parseInt(document.getElementById("idLenteContacto").value);
        lente.producto.idProducto = parseInt(document.getElementById("idProducto").value);
    }



    //Producto
    lente.producto.nombre = document.getElementById("txtNombre").value;
    lente.producto.marca = document.getElementById("txtMarca").value;
    lente.producto.codigoBarras = document.getElementById("txtCodigoBarrasL").value;
    lente.producto.precioCompra = document.getElementById("txtPrecioCompraL").value;
    lente.producto.precioVenta = document.getElementById("txtPrecioVentaL").value;
    lente.producto.existencias = document.getElementById("txtExistenciasL").value;


    //Lentes Contacto

    lente.keratometria = document.getElementById("txtQueratometria").value;
    lente.fotografia = document.getElementById("imgLente").value;


    datos = {
        datosLenteContacto: JSON.stringify(lente),
        token: autenticarToken()
    };

    params = new URLSearchParams(datos);

    autenticarToken();
    fetch("../api/lente/save",
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

        document.getElementById("idLenteContacto").value = lente.idLenteContacto;
        document.getElementById("idProducto").value = lente.producto.idProducto;


        Swal.fire('', 'Datos del empleado actualizados correctamente', 'success');
        refreshTable();
    });

}


//Este metodo nos va permitir remover un lente de contacto de nuestra tabla, o bien de los que tenemos
//previamente registrados en nuestra base de datos, y a la vez ejecutando el boton eliminar dentro del modulo 
//de lentes de contacto
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
    let lente = new Object();
    lente.producto = new Object();

    if (document.getElementById("idLenteContacto").value.trim().length < 1) {
        Swal.fire('', 'Selecciona un Lente de Contacto', 'error');
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
                lente.idLenteContacto = parseInt(document.getElementById("idLenteContacto").value);

                datos = {
                    datosLenteContacto: JSON.stringify(lente),
                    token: autenticarToken()
                };

                params = new URLSearchParams(datos);

                autenticarToken();
                //usamos el fetch para poder encontrar la ruta del JSON de la funcion remover dentro de la pagina
                fetch("../api/lente/remove",
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

                    document.getElementById("idLenteContacto").value = data.idLenteContacto;


                    Swal.fire('', 'Datos del Lente de Contacto eliminados correctamente', 'success');
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





