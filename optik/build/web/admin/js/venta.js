let productos = [];
let listaDetalleP = [];
let idAuto = 0;

export function inicializarVenta() {
    refreshTable();
    configureTableFilter(document.getElementById("txtSearch"), document.getElementById("tblProductos"));
}

export function fillTable(data) {
    //Declaramos una variable donde se guardara el contenido de la tabla:
    let contenido = '';
    productos = data;
    //Recorrer el Arreglo
    for (let i = 0; i < data.length; i++) {
        //Vamos generando el contenido de la tabla dinamicamente:
        contenido +=
                '<tr>' +
                '<td>' + data[i].codigoBarras + '</td>' +
                '<td>' + data[i].nombre + '</td>' +
                '<td>' + data[i].precioVenta + '</td>' +
                '<td> <a href="#" onclick="cm.agregar(' + i + ');"> <i class="fas fa-plus"></i> </a> </td>' +
                '</tr>';
    }
    document.getElementById('tbodyProductos').innerHTML = contenido;
}

export function refreshTable() {
    let url = "../api/producto/getAll";
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

export function agregar(i) {

    let p = productos[i];
    let contenido = "";

    contenido +=
            '<tr>' +
            '<td>' + p.codigoBarras + '</td>' +
            '<td>' + p.nombre + '</td>' +
            '<td>' + p.precioVenta + '</td>' +
            '<td><input id="txtCantidad' + idAuto + '" type="number" value = "1" min="1" max="' + p.existencias + '" onkeypress="return false;"></td>' +
            '<td><input id="txtDescuento' + idAuto + '" type="number" value = "0" min="0" onkeypress="return event.charCode >= 48 && event.charCode<=57"></td>' +
            '<td><a href="#"><i class="fas fa-trash"></i></a></td>' +
            '</tr>';
    document.getElementById("tbodyVentaP").innerHTML += contenido;

    let cantidad = document.getElementById("txtCantidad" + idAuto).value;
    let descuento = document.getElementById("txtDescuento" + idAuto).value;

    let ventaP = {cantidad: cantidad, precioUnitario: p.precioVenta, descuento: descuento, producto: p};
    listaDetalleP[idAuto] = ventaP;
    idAuto++;
    console.log(ventaP);
    
}

export function enviarCarrito() {

    let f = new Date();
    let clave = "OQ-" + f.getDate() + '/' + f.getMonth() + '/' + f.getHours() + ':' + f.getMinutes() + ':' + f.getMilliseconds();

    document.getElementById("txtClaveVenta").value = clave;

    for (var i = 0; i < listaDetalleP.length; i++) {
        listaDetalleP[i].cantidad = document.getElementById("txtCantidad" + i).value;
        listaDetalleP[i].descuento = document.getElementById("txtDescuento" + i).value;
    }
    
    let venta = {
        empleado: JSON.parse(localStorage.getItem("empleado")),
        clave: clave.toString()
    };

    let dvp = {
        venta: venta,
        lvp: listaDetalleP
    };


    let datos = {
        datosVenta: JSON.stringify(dvp),
        token: autenticarToken()
    };

    console.log(venta);
    console.log(dvp);
    console.log(datos);

    let params = new URLSearchParams(datos);


    fetch("../api/venta/save",
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

        if (data.venta.idVenta) {
            mandarConfirmacionGuardar();
        }
    });
    calcularTotal();
}

export function calcularTotal() {
    let total = 0;
    for (var i = 0; i < listaDetalleP.length; i++) {
        let precioUnitario = listaDetalleP[i].precioUnitario;
        let cantidadOriginal = document.getElementById("txtCantidad" + i).value;
        let porcentajeDescuento = document.getElementById("txtDescuento" + i).value;

        let cantidadConDescuento = (cantidadOriginal*precioUnitario) * (1 - (porcentajeDescuento / 100));
        console.log("La cantidad con descuento es: " + cantidadConDescuento);
        
        total+=cantidadConDescuento;
    }
    
    document.getElementById("txtTotalVenta").value = total;
}