/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

/* global fetch, Swal, import */

function login() {

    user = document.getElementById("txtUser").value;
    password = document.getElementById("txtPassword").value;

    encriptar(password).then((textoEncriptado) => {
        let url = "./api/login/login?usuario=" + user + "&contrasenia=" + textoEncriptado;
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


                    if (data.usuario.rol === "Administrador" && data.usuario.lastToken != null) {
                        data.usuario.contrasenia = textoEncriptado;
                        let usuario = JSON.stringify(data.usuario);
                        let empleado = JSON.stringify(data);
                        localStorage.setItem("empleado", empleado);
                        localStorage.setItem("usuario", usuario);
                        console.log(usuario);
                        window.location.replace('./admin');
                    } else {
                        mandarError();
                    }
                });
    });
}

function logout() {

    let data = localStorage.getItem("usuario");
    let usuario = new Object();
    usuario = JSON.parse(data);

    let datos = {
        user: JSON.stringify(usuario)
    };

    let params = new URLSearchParams(datos);


    fetch("../api/login/out",
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

        if (data.ok) {
            console.log(data.ok);
            window.location.replace('../index.html');
            localStorage.removeItem("usuario");
            localStorage.removeItem("empleado");
        }



    });



}

function mandarError() {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: 'Datos Incorrectos',
        showConfirmButton: false,
        timer: 2000
    });
}

async function encriptar(texto) {
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}