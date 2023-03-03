/* global Swal */

function mandarConfirmacionEliminar()
{
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Eliminado correctamente',
        showConfirmButton: false,
        timer: 1500
    });
}

function mandarConfirmacionGuardar()
{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Guardado correctamente',
        showConfirmButton: false,
        timer: 2000
    });
}

function mandarConfirmacionActualizar()
{
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Actualizado Correctamente',
        showConfirmButton: false,
        timer: 1500
    });
}

function mandarNotificación()
{
    alert("Se Envio la Notificación");
}

function mandarNotificacion()
{
    let cliente = document.getElementById('txtNumeroUnicoCliente').value;
    alert("Se Notificó al Cliente " + cliente);
}

function cancelarPresupuesto()
{
    let presupuesto = document.getElementById('txtClaveUnicaPresupuesto').value;
    alert("El Presupuesto " + presupuesto + " se ha Cancelado.");
}

function mandarError()
{
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error',
        showConfirmButton: false,
        timer: 1500
    });
}

function mantenimiento()
{
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Lo sentimos, este modulo esta en mantenimiento!'
    })
}


function campoIncorrecto(texto)
{
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: texto,
        showConfirmButton: false,
        timer: 1500
    });
}

