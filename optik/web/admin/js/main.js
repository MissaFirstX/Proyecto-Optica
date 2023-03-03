
/* global Swal */

//Se declara la variable cm(Cargar Modulo) 
let cm = null;
const body = document.getElementById("contenedor_principal");
const barra = document.getElementById("barra_nav");

function autenticarToken() {

    let data = localStorage.getItem("usuario");
    let fecha = new Date();

    if (data != null) {

        let usuario = new Object();
        usuario = JSON.parse(data);


        if (usuario.lastToken) {
            return usuario.lastToken;
        } else {
            barra.style.display = false;
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: '',
                text: 'Inicia Sesión',
                showConfirmButton: false,
                timer: 1000
            });
            setTimeout(function () {
                window.location.replace('../');

            }, 1500);
        }


    } else {
        barra.style.display = false;
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: '',
            text: 'Inicia Sesión',
            showConfirmButton: false,
            timer: 1000
        });
        setTimeout(function () {
            window.location.replace('../');
        }, 1000);
    }

}

function cargarModuloEmpleado() {

    autenticarToken();
    //AJAX: Asynchronous
    fetch('empleado/empleado.html')
            .then(respuesta => {
                //Devolvemos el contenido
                //de la respuesta en formato
                //texto:
                return respuesta.text();
            })
            .then(datos => {

                //Insertamos el codigo HTML
                //dentro del contenedor principal
                document.getElementById('contenedor_principal').innerHTML = datos;
                import('./empleado.js').then(obj => {
                    cm = obj;
                    cm.inicializarEmpleado();
                });
            });
}

function cargarModuloCliente() {
    autenticarToken();
    //AJAX: Asynchronous
    fetch('cliente/cliente.html')
            .then(respuesta => {
                //Devolvemos el contenido
                //de la respuesta en formato
                //texto:
                return respuesta.text();
            })
            .then(datos => {

                //Insertamos el codigo HTML
                //dentro del contenedor principal
                document.getElementById('contenedor_principal').innerHTML = datos;
                import('./cliente.js').then(obj => {
                    cm = obj;
                    cm.inicializarCliente();
                });
            });
}

function cargarModuloAccesorio() {
    autenticarToken();
    //AJAX: Asynchronous
    fetch('producto/accesorio/accesorio.html')
            .then(respuesta => {
                //Devolvemos el contenido
                //de la respuesta en formato
                //texto:
                return respuesta.text();
            })
            .then(datos => {

                //Insertamos el codigo HTML
                //dentro del contenedor principal
                document.getElementById('contenedor_principal').innerHTML = datos;
                import('./accesorio.js')
                        .then(obj => {
                            cm = obj;
                            cm.inicializarAccesorio();
                        });
            });
}

function cargarModuloArmazon() {
    autenticarToken();
    //AJAX: Asynchronous
    fetch('producto/armazon/armazon.html')
            .then(respuesta => {
                //Devolvemos el contenido
                //de la respuesta en formato
                //texto:
                return respuesta.text();
            })
            .then(datos => {

                //Insertamos el codigo HTML
                //dentro del contenedor principal
                document.getElementById('contenedor_principal').innerHTML = datos;
                import('./armazon.js')
                        .then(obj => {
                            cm = obj;
                            cm.inicializarArmazon();
                        });
            });
}



function normalizar(texto){
     for (var i = 0; i < texto.length; i++) {
        texto = texto.replace("Á", "A");
        texto = texto.replace("E", "E");
        texto = texto.replace("Í", "I");
        texto = texto.replace("Ó", "O");
        texto = texto.replace("Ú", "U");
       

    }
    return texto;
}

function cargarModuloSolucion() {
    autenticarToken();
    //AJAX: Asynchronous
    fetch('producto/solucion/solucion.html')
            .then(respuesta => {
                //Devolvemos el contenido
                //de la respuesta en formato
                //texto:
                return respuesta.text();
            })
            .then(datos => {

                //Insertamos el codigo HTML
                //dentro del contenedor principal
                document.getElementById('contenedor_principal').innerHTML = datos;
                import('./solucion.js')
                        .then(obj => {
                            cm = obj;
                            cm.inicializarSol();
                        });
            });
}

function cargarModuloLentes() {
    autenticarToken();
    //alert('hi')
    //AJAX: Asynchronous
    fetch('producto/lente/lentesdecontacto.html')
            .then(respuesta => {

                //Devolvemos el contenido
                //de la respuesta en formato
                //texto:
                return respuesta.text();
            })
            .then(datos => {

                //Insertamos el codigo HTML
                //dentro del contenedor principal
                document.getElementById('contenedor_principal').innerHTML = datos;
                import('./lentescontacto.js').then(obj => {
                    cm = obj;
                    cm.inicializarLentesConct();
                });
            });
}

function cargarModuloVenta() {
    autenticarToken();
    //alert('hi')
    //AJAX: Asynchronous
    fetch('venta/venta.html')
            .then(respuesta => {

                //Devolvemos el contenido
                //de la respuesta en formato
                //texto:
                return respuesta.text();
            })
            .then(datos => {

                //Insertamos el codigo HTML
                //dentro del contenedor principal
                document.getElementById('contenedor_principal').innerHTML = datos;
                import('./venta.js').then(obj => {
                    cm = obj;
                    cm.inicializarVenta();
                });
            });
}

body.addEventListener("load", autenticarToken());

function cerrarModulo() {
    autenticarToken();
    window.location.replace('');
}
