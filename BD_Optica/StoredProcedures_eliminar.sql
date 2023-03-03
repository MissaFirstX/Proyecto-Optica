######################## ELIMINAR #################################
USE optiqalumnos;

DROP PROCEDURE IF EXISTS eliminarEmpleado;
DELIMITER $$
CREATE PROCEDURE eliminarEmpleado(IN var_idEmpleado INT)                                    
    BEGIN        
        UPDATE empleado  SET estatus = 0 WHERE idEmpleado = var_idEmpleado;
    END
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS eliminarCliente;
DELIMITER $$
CREATE PROCEDURE eliminarCliente(IN var_idCliente INT)                                    
    BEGIN        
        UPDATE cliente  SET estatus = 0 WHERE idCliente = var_idCliente;
    END
$$
DELIMITER ;


select*from v_clientes where estatus=0;

call eliminarCliente(3);

DROP PROCEDURE IF EXISTS eliminarProducto;
DELIMITER $$
CREATE PROCEDURE eliminarProducto(IN var_idProducto INT)                                    
    BEGIN        
        UPDATE producto  SET estatus = 0 WHERE idProducto = var_idProducto;
    END
$$
DELIMITER ;
