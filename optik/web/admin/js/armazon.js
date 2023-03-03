//Iniciamos el arreglo armazones
let armazones = [];
let inputFileArmazon = null;

//funcion que se inicia al entrar al modulo
export function inicializarArmazon() {
    //llamamos a a la funcion que llena la tabla
    refreshTable();
    configureTableFilter(document.getElementById("txtSearch"), document.getElementById("tblArmazon"));
    inputFileArmazon = document.getElementById("inputFileImagenArmazon");
    inputFileArmazon.onchange = function (evt) {
        cargarFotografia(inputFileArmazon);
    };
}

//funcion que obtiene datos para llenar la tabla
export function refreshTable() {
    //direccion de nuestra rest que obtiene todos los datos
    let url = "../api/armazon/getAll";

    //llamada tipo ajax de nuestra api
    fetch(url)
            //retornamos la promesa
            .then(response => {
                return response.json();
            })
            //el json de la promesa lo metemos al data
            .then(function (data)

            {
                //si obtiene un valor diferente a null en la excepcion nos manda un mensaje de error
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

                //al terminar mandamos la data a la funcion que llenara nuestra tabla
                fillTable(data);
            });
}

//funcion que llenara nuestra tabla
export function fillTable(data) {

    //inicializamos nuestra variable que tendra el contenido de la tabla
    let contenido = '';

    //le asignamos la data a armazones
    armazones = data;

    //Recorrer el Arreglo
    for (let i = 0; i < data.length; i++) {
        //guardamos el estatos de la data en una variable
        let dat = data[i].producto.estatus;

        //si el estatos es 1 se cambiara por "Activo", sino sera Inactivo
        if (dat === 1) {
            dat = "Activo";
        } else {
            dat = "Inactivo";
        }

        //Vamos generando el contenido de la tabla dinamicamente:
        contenido += '<tr>' +
                '<td>' + data[i].producto.nombre + ' ' + '</td>' +
                '<td>' + data[i].producto.marca + '</td>' +
                '<td>' + data[i].producto.precioCompra + '</td>' +
                '<td>' + data[i].producto.precioVenta + '</td>' +
                '<td>' + data[i].producto.existencias + '</td>' +
                '<td>' + dat + '</td>' +
                //creamos un tipo de "boton" que contiene la posicion
                '<td><a href="#" onclick="cm.mostrarDetalleArmazon(' + i + ');"><i class="fas fa-pencil-alt"></i></a></td>' +
                '</tr>';
    }
    //Mandamo el contenido generado a nuestra tabla por el id
    document.getElementById('tbodyArmazon').innerHTML = contenido;
}

//funcion que obtiene los datos y los manda al formulario
export function mostrarDetalleArmazon(posicion) {

    //guardamos armazon y su posicion dentro de e
    let a = armazones[posicion];

    //limpiamos en formulario para evitar que se junten datos que haya puesto el usuario
    limpiarFormularioDetalle();

    //llenamos el formulario con los datos obtenidos de a
    //Datos del producto
    document.getElementById("txtCodigoProducto").value = a.producto.idProducto;
    document.getElementById("txtCodigoBarrasAr").value = a.producto.codigoBarras;
    document.getElementById("txtNombreAr").value = a.producto.nombre;
    document.getElementById("txtMarcaAr").value = a.producto.marca;
    document.getElementById("txtPrecioCompraAr").value = a.producto.precioCompra;
    document.getElementById("txtPrecioVentaAr").value = a.producto.precioVenta;
    document.getElementById("txtExistenciasAr").value = a.producto.existencias;

    //datos del armazon
    document.getElementById("txtCodigoArmazon").value = a.idArmazon;
    document.getElementById("txtModeloAr").value = a.modelo;
    document.getElementById("colorAr").value = a.color;
    document.getElementById("txtDimensionesAr").value = a.dimensiones;
    document.getElementById("txtDescripcionAr").value = a.descripcion;
    document.getElementById("imgArmazon").value = a.fotografia;




}

//funcion que limpia el formulario
export function limpiarFormularioDetalle()
{
    document.getElementById("txtCodigoProducto").value = null;
    document.getElementById("txtCodigoBarrasAr").value = null;
    document.getElementById("txtNombreAr").value = null;
    document.getElementById("txtMarcaAr").value = null;
    document.getElementById("txtPrecioCompraAr").value = null;
    document.getElementById("txtPrecioVentaAr").value = null;
    document.getElementById("txtExistenciasAr").value = null;

    document.getElementById("txtCodigoArmazon").value = null;
    document.getElementById("txtModeloAr").value = null;
    document.getElementById("colorAr").value = null;
    document.getElementById("txtDimensionesAr").value = null;
    document.getElementById("txtDescripcionAr").value = null;
    document.getElementById("imgArmazon").value = null;
    document.getElementById("inputFileImagenArmazon").value = null;
    document.getElementById("txtaCodigoImagen").value = null;
}

//funcion para hacer la peticion de insertar
export function save() {

    //inicializamos como null
    let datos = null;
    let params = null;



    //Definimos los atributos y valores del armazon
    let armazon = new Object();
    armazon.producto = new Object();

    //Revisamos si hay algun valor en la caja de texto del id del armazon:
    //El trim quita espacios a la derecha e izquierda
    if (document.getElementById("txtCodigoArmazon").value.trim().length < 1) {
        armazon.idArmazon = 0;
        armazon.producto.idProducto = 0;
    } else {
        //Si el armazon ya tiene un id, lo tomamos para actualizar sus datos:
        armazon.idArmazon = parseInt(document.getElementById("txtCodigoArmazon").value);
        armazon.producto.idProducto = parseInt(document.getElementById("txtCodigoProducto").value);
    }

    //tomamos los valores restantes
    armazon.producto.codigoBarras = document.getElementById("txtCodigoBarrasAr").value;
    armazon.producto.nombre = sanitizar(document.getElementById("txtNombreAr").value);
    armazon.producto.marca = sanitizar(document.getElementById("txtMarcaAr").value);
    armazon.producto.precioCompra = document.getElementById("txtPrecioCompraAr").value;
    armazon.producto.precioVenta = document.getElementById("txtPrecioVentaAr").value;
    armazon.producto.existencias = document.getElementById("txtExistenciasAr").value;

    armazon.modelo = sanitizar(document.getElementById("txtModeloAr").value);
    armazon.color = document.getElementById("colorAr").value;
    armazon.dimensiones = sanitizar(document.getElementById("txtDimensionesAr").value);
    armazon.descripcion = sanitizar(document.getElementById("txtDescripcionAr").value);
    armazon.fotografia = "";

    //guardamos dentro de datos como json a armazon
    datos = {
        datosArmazon: JSON.stringify(armazon),
        token: autenticarToken()
    };

    //definimos los parametros de consulta de la url y lo guardamos en params
    params = new URLSearchParams(datos);


    autenticarToken();
    //llamamos a nuestra api
    fetch("../api/armazon/save",
            {
                //hacemos un POST a nuestra api (el body ya tendra todos nuestros datos)
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            }).then(response => {
        return response.json();
    }).then(function (data) {

        //Obtenemos excepciones si es que hay alguna
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

        document.getElementById("txtCodigoArmazon").value = data.idArmazon;
        document.getElementById("txtCodigoProducto").value = data.producto.idProducto;
        document.getElementById("txtCodigoBarrasAr").value = data.producto.codigoBarras;

        //alerta que confirma la accion realizada
        mandarConfirmacionGuardar();
        //refrescamos la tabla
        refreshTable();
        //limpiamos elformulario
        limpiarFormularioDetalle();
    });
}

//funcion para eliminar, es exactamente igual a la de guardar, solo que dentro del json solo ira la id del producto
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

    let armazon = new Object();
    armazon.producto = new Object();

    //verificamos que se haya seleccionado un armazon a eliminar
    if (document.getElementById("txtCodigoProducto").value.trim().length < 1) {
        Swal.fire('', 'Selecciona un Armazon', 'error');
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
                armazon.producto.idProducto = parseInt(document.getElementById("txtCodigoProducto").value);

                datos = {
                    datosArmazon: JSON.stringify(armazon),
                    token: autenticarToken()
                };

                params = new URLSearchParams(datos);

                autenticarToken();
                fetch("../api/armazon/remove",
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

                    document.getElementById("txtCodigoArmazon").value = data.idArmazon;

                    Swal.fire('', 'Datos del armazon eliminados correctamente', 'success');
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

function cargarFotografia(objetoInputFile) {
    //Revisamos que el usuario haya seleccionado un archivo:
    if (objetoInputFile.files && objetoInputFile.files[0]) {
        let reader = new FileReader();

        //Agregamos un oyente al lector del archivo para que, en cuanto el usuario cargue una imagen, esta se lea y se convierta de forma automatica en una cadena de base64:
        reader.onload = function (e) {
            let fotoB64 = e.target.result;
            document.getElementById("imgArmazon").src = fotoB64;
            document.getElementById("txtaCodigoImagen").value = fotoB64.substring(fotoB64.indexOf(",") + 1, fotoB64.length);
        };

        //leemos el archivo que selecciono el usuario y lo convertimos en una cadena con la base64:
        reader.readAsDataURL(objetoInputFile.files[0]);
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