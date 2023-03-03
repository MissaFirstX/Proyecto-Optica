/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


function sendFecha(fecha) {
    let annio;
    let mes;
    let dia;
}

function fechaBien(fecha){
    fecha.toString();
    
    let annio = fecha.substring(6,10);
    let mes = fecha.substring(3,5);
    let dia = fecha.substring(0,2);
    let hora = fecha.substring(11,18);
   
    let fecha2 = annio+"-"+mes+"-"+dia+""+hora;
    
    return fecha2;
}

