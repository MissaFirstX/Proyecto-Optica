-- ---------------------------------------------------------------- --
-- Archivo: 02_StoredProcedures_Optica.sql                          -- 
-- Version: 1.0                                                     --
-- Autor:   Miguel Angel Gil Rios   								--
-- Email:   angel.grios@gmail.com / mgil@utleon.edu.mx              --
-- Fecha de elaboracion: 25-12-2021                                 --
-- ---------------------------------------------------------------- --

USE optiqalumnos;
 
-- Stored Procedure para insertar nuevos Empleados.
DROP PROCEDURE IF EXISTS insertarEmpleado;
DELIMITER $$
CREATE PROCEDURE insertarEmpleado(	/* Datos Personales */
                                    IN	var_nombre          VARCHAR(64),    --  1
                                    IN	var_apellidoPaterno VARCHAR(64),    --  2
                                    IN	var_apellidoMaterno VARCHAR(64),    --  3
                                    IN  var_genero          VARCHAR(2),     --  4
                                    IN  var_fechaNacimiento VARCHAR(11),    --  5
                                    IN	var_calle           VARCHAR(129),   --  6
                                    IN  var_numero          VARCHAR(20),    --  7
                                    IN  var_colonia         VARCHAR(40),    --  8
                                    IN  var_cp              VARCHAR(25),    --  9
                                    IN  var_ciudad          VARCHAR(40),    -- 10
                                    IN  var_estado          VARCHAR(40),    -- 11
                                    IN	var_telcasa         VARCHAR(20),    -- 12
                                    IN	var_telmovil        VARCHAR(20),    -- 13
                                    IN	var_email           VARCHAR(129),   -- 14
                                    
                                    /* Datos de Usuario */
                                    IN	var_nombreUsuario   VARCHAR(129),   -- 15
                                    IN	var_contrasenia     VARCHAR(129),   -- 16
                                    IN	var_rol             VARCHAR(25),    -- 17                                    
                                    
                                    /* Valores de Retorno */
                                    OUT	var_idPersona       INT,            -- 18
                                    OUT	var_idUsuario       INT,            -- 19
                                    OUT	var_idEmpleado      INT,            -- 20
                                    OUT	var_numeroUnico     VARCHAR(65),    -- 21
                                    OUT var_lastToken       VARCHAR(65)     -- 22
				)                                    
    BEGIN        
        -- Comenzamos insertando los datos de la Persona:
        INSERT INTO persona (nombre, apellidoPaterno, apellidoMaterno, genero,
                             fechaNacimiento, calle, numero, colonia, cp, ciudad,
                             estado, telcasa, telmovil, email)
                    VALUES( var_nombre, var_apellidoPaterno, var_apellidoMaterno, 
                            var_genero, STR_TO_DATE(var_fechaNacimiento, '%d/%m/%Y'), 
                            var_calle, var_numero, var_colonia, var_cp, var_ciudad,
                            var_estado, var_telcasa, var_telmovil, var_email);
        -- Obtenemos el ID de Persona que se generó:
        SET var_idPersona = LAST_INSERT_ID();

        -- Insertamos los datos de seguridad del Empleado:
        INSERT INTO usuario ( nombre, contrasenia, rol) 
                    VALUES( var_nombreUsuario, var_contrasenia, var_rol);
        -- Obtenemos el ID de Usuario que se generó:
        SET var_idUsuario = LAST_INSERT_ID();

        --  Generamos el numero unico de empleado.        
        SET var_numeroUnico = '';
        --  Agregamos la primera letra del apellidoPaterno:
        IF  LENGTH(var_apellidoPaterno) >= 1 THEN
            SET var_numeroUnico = SUBSTRING(var_apellidoPaterno, 1, 1);
        ELSE
            SET var_numeroUnico = 'X';
        END IF;
        --  Agregamos la segunda letra del apellidoPaterno:
        IF  LENGTH(var_apellidoPaterno) >= 2 THEN
            SET var_numeroUnico = CONCAT(var_numeroUnico, SUBSTRING(var_apellidoPaterno, 2, 1));
        ELSE
            SET var_numeroUnico = CONCAT(var_numeroUnico, 'X');
        END IF;        
        --  Agregamos el timestamp:
        SET var_numeroUnico = CONCAT(var_numeroUnico, CAST(UNIX_TIMESTAMP() AS CHAR));
        -- Codificamos el numero unico generado:
        SET var_numeroUnico = MD5(var_numeroUnico);

        -- Finalmente, insertamos en la tabla Empleado:
        INSERT INTO empleado (idPersona, idUsuario, numeroUnico)
                    VALUES(var_idPersona, var_idUsuario, var_numeroUnico);
        -- Obtenemos el ID del Empleado que se genero:
        SET var_idEmpleado = LAST_INSERT_ID();
    END
$$
DELIMITER ;

-- Stored Procedure para actualizar datos de Empleados.
DROP PROCEDURE IF EXISTS actualizarEmpleado;
DELIMITER $$
CREATE PROCEDURE actualizarEmpleado(	/* Datos Personales */
                                    IN	var_nombre          VARCHAR(64),    --  1
                                    IN	var_apellidoPaterno VARCHAR(64),    --  2
                                    IN	var_apellidoMaterno VARCHAR(64),    --  3
                                    IN  var_genero          VARCHAR(2),     --  4
                                    IN  var_fechaNacimiento VARCHAR(11),    --  5
                                    IN	var_calle           VARCHAR(129),   --  6
                                    IN  var_numero          VARCHAR(20),    --  7
                                    IN  var_colonia         VARCHAR(40),    --  8
                                    IN  var_cp              VARCHAR(25),    --  9
                                    IN  var_ciudad          VARCHAR(40),    -- 10
                                    IN  var_estado          VARCHAR(40),    -- 11
                                    IN	var_telcasa         VARCHAR(20),    -- 12
                                    IN	var_telmovil        VARCHAR(20),    -- 13
                                    IN	var_email           VARCHAR(129),   -- 14
                                    
                                    /* Datos de Usuario */
                                    IN	var_nombreUsuario   VARCHAR(129),   -- 15
                                    IN	var_contrasenia     VARCHAR(129),   -- 16
                                    IN	var_rol             VARCHAR(25),    -- 17                                    
                                    
                                    /* IDs */
                                    IN	var_idPersona       INT,            -- 18
                                    IN	var_idUsuario       INT,            -- 19
                                    IN	var_idEmpleado      INT             -- 20
				)                                    
    BEGIN        
        -- Comenzamos actualizando los datos de la Persona:
        UPDATE persona  SET nombre = var_nombre, apellidoPaterno = var_apellidoPaterno, 
                            apellidoMaterno = var_apellidoMaterno, genero = var_genero,
                            fechaNacimiento = STR_TO_DATE(var_fechaNacimiento, '%d/%m/%Y'), 
                            calle = var_calle, numero = var_numero, colonia = var_colonia, 
                            cp = var_cp, ciudad = var_ciudad, estado = var_estado, 
                            telcasa = var_telcasa, telmovil = var_telmovil, email = var_email 
                        WHERE idPersona = var_idPersona;
                        
        -- Actualizamos los datos de seguridad del Empleado:
        UPDATE usuario  SET nombre = var_nombreUsuario, 
                            contrasenia = var_contrasenia, rol = var_rol 
                        WHERE idUsuario = var_idUsuario;
    END
$$
DELIMITER ;

-- Stored Procedure para insertar nuevos Clientes.
DROP PROCEDURE IF EXISTS insertarCliente;
DELIMITER $$
CREATE PROCEDURE insertarCliente(	/* Datos Personales */
                                    IN	var_nombre          VARCHAR(64),    --  1
                                    IN	var_apellidoPaterno VARCHAR(64),    --  2
                                    IN	var_apellidoMaterno VARCHAR(64),    --  3
                                    IN  var_genero          VARCHAR(2),     --  4
                                    IN  var_fechaNacimiento VARCHAR(11),    --  5
                                    IN	var_calle           VARCHAR(129),   --  6
                                    IN  var_numero          VARCHAR(20),    --  7
                                    IN  var_colonia         VARCHAR(40),    --  8
                                    IN  var_cp              VARCHAR(25),    --  9
                                    IN  var_ciudad          VARCHAR(40),    -- 10
                                    IN  var_estado          VARCHAR(40),    -- 11
                                    IN	var_telcasa         VARCHAR(20),    -- 12
                                    IN	var_telmovil        VARCHAR(20),    -- 13
                                    IN	var_email           VARCHAR(129),    -- 14
                                    
                                    /* Valores de Retorno */
                                    OUT	var_idPersona       INT,            -- 15
                                    OUT	var_idCliente       INT,            -- 16
                                    OUT	var_numeroUnico     VARCHAR(65)     -- 17
				)                                    
    BEGIN        
        -- Comenzamos insertando los datos de la Persona:
        INSERT INTO persona (nombre, apellidoPaterno, apellidoMaterno, genero,
                             fechaNacimiento, calle, numero, colonia, cp, ciudad,
                             estado, telcasa, telmovil, email)
                    VALUES( var_nombre, var_apellidoPaterno, var_apellidoMaterno, 
                            var_genero, STR_TO_DATE(var_fechaNacimiento, '%d/%m/%Y'), 
                            var_calle, var_numero, var_colonia, var_cp, var_ciudad,
                            var_estado, var_telcasa, var_telmovil, var_email);
        -- Obtenemos el ID de Persona que se generó:
        SET var_idPersona = LAST_INSERT_ID();
        
        --  Generamos el numero unico de Cliente:        
        SET var_numeroUnico = '';
        --  Agregamos la primera letra del apellidoPaterno:
        IF  LENGTH(var_apellidoPaterno) >= 1 THEN
            SET var_numeroUnico = SUBSTRING(var_apellidoPaterno, 1, 1);
        ELSE
            SET var_numeroUnico = 'X';
        END IF;
        --  Agregamos la segunda letra del apellidoPaterno:
        IF  LENGTH(var_apellidoPaterno) >= 2 THEN
            SET var_numeroUnico = CONCAT(var_numeroUnico, SUBSTRING(var_apellidoPaterno, 2, 1));
        ELSE
            SET var_numeroUnico = CONCAT(var_numeroUnico, 'X');
        END IF;        
        --  Agregamos el timestamp:
        SET var_numeroUnico = CONCAT(var_numeroUnico, CAST(UNIX_TIMESTAMP() AS CHAR));
        -- Codificamos el numero unico generado:
        SET var_numeroUnico = MD5(var_numeroUnico);

        -- Finalmente, insertamos en la tabla Cliente:
        INSERT INTO cliente (idPersona, numeroUnico)
                    VALUES(var_idPersona, var_numeroUnico);
        -- Obtenemos el ID del Cliente que se genero:
        SET var_idCliente = LAST_INSERT_ID();
    END
$$
DELIMITER ;

-- Stored Procedure para actualizar datos de Clientes.
DROP PROCEDURE IF EXISTS actualizarCliente;
DELIMITER $$
CREATE PROCEDURE actualizarCliente(	/* Datos Personales */
                                    IN	var_nombre          VARCHAR(64),    --  1
                                    IN	var_apellidoPaterno VARCHAR(64),    --  2
                                    IN	var_apellidoMaterno VARCHAR(64),    --  3
                                    IN  var_genero          VARCHAR(2),     --  4
                                    IN  var_fechaNacimiento VARCHAR(11),    --  5
                                    IN	var_calle           VARCHAR(129),   --  6
                                    IN  var_numero          VARCHAR(20),    --  7
                                    IN  var_colonia         VARCHAR(40),    --  8
                                    IN  var_cp              VARCHAR(25),    --  9
                                    IN  var_ciudad          VARCHAR(40),    -- 10
                                    IN  var_estado          VARCHAR(40),    -- 11
                                    IN	var_telcasa         VARCHAR(20),    -- 12
                                    IN	var_telmovil        VARCHAR(20),    -- 13
                                    IN	var_email           VARCHAR(129),    -- 14                             
                                    
                                    /* IDs */
                                    IN	var_idPersona       INT,            -- 15
                                    IN	var_idCliente       INT             -- 16
				)                                    
    BEGIN        
        -- Comenzamos actualizando los datos de la Persona:
        UPDATE persona  SET nombre = var_nombre, apellidoPaterno = var_apellidoPaterno, 
                            apellidoMaterno = var_apellidoMaterno, genero = var_genero,
                            fechaNacimiento = STR_TO_DATE(var_fechaNacimiento, '%d/%m/%Y'), 
                            calle = var_calle, numero = var_numero, colonia = var_colonia, 
                            cp = var_cp, ciudad = var_ciudad, estado = var_estado, 
                            telcasa = var_telcasa, telmovil = var_telmovil, email = var_email 
                        WHERE idPersona = var_idPersona;
    END
$$
DELIMITER ;



-- Stored Procedure para insertar nuevas Soluciones.
DROP PROCEDURE IF EXISTS insertarSolucion;
DELIMITER $$
CREATE PROCEDURE insertarSolucion(	/* Datos del Producto */
                                    IN  var_codigoBarrasIn  VARCHAR(48),    --  1
                                    IN	var_nombre          VARCHAR(64),    --  2
                                    IN	var_marca           VARCHAR(64),    --  3
                                    IN	var_precioCompra    DOUBLE,         --  4
                                    IN  var_precioVenta     DOUBLE,         --  5
                                    IN  var_existencias     INT,            --  6
                                    
                                    /* Valores de Retorno */
                                    OUT	var_idProducto      INT,            --  7
                                    OUT	var_idSolucion      INT,            --  8
                                    OUT	var_codigoBarrasOut VARCHAR(48)     --  9
				)                                    
    BEGIN        
        -- Comenzamos insertando los datos del Producto:
        INSERT INTO producto (nombre, marca, precioCompra, precioVenta, existencias, estatus)
                    VALUES   (var_nombre, var_marca, var_precioCompra, var_precioVenta,
                              var_existencias, 1);
        -- Obtenemos el ID de Producto que se generó:
        SET var_idProducto = LAST_INSERT_ID();

        -- Finalmente, insertamos en la tabla Solucion:
        INSERT INTO solucion (idProducto)
                    VALUES(var_idProducto);
        -- Obtenemos el ID de la Solucion que se genero:
        SET var_idSolucion = LAST_INSERT_ID();
        
        -- Generamos su codigo de barras:
        IF var_codigoBarrasIn IS NOT NULL OR var_codigoBarrasIn != '' THEN
            SET var_codigoBarrasOut = var_codigoBarrasIn;
        ELSE
            SET var_codigoBarrasOut = CONCAT('OQ-P', var_idProducto, '-S', var_idSolucion);
        END IF;
        
        -- Actualizamos el registro:
        UPDATE producto SET codigoBarras = var_codigoBarrasOut WHERE idProducto = var_idProducto;
    END
$$
DELIMITER ;

-- Stored Procedure para actualizar datos de Soluciones.
DROP PROCEDURE IF EXISTS actualizarSolucion;
DELIMITER $$
CREATE PROCEDURE actualizarSolucion(	/* Datos del Producto */
                                    IN	var_codigoBarras    VARCHAR(48),    --  1
                                    IN	var_nombre          VARCHAR(64),    --  2
                                    IN	var_marca           VARCHAR(64),    --  3
                                    IN	var_precioCompra    DOUBLE,         --  4
                                    IN  var_precioVenta     DOUBLE,         --  5
                                    IN  var_existencias     INT,            --  6
                                    IN	var_idProducto      INT             --  7                                    
				)                                    
    BEGIN        
        -- Actualizamos los datos del Producto:
        UPDATE producto SET codigoBarras = var_codigoBarras, nombre = var_nombre, marca = var_marca, 
                            precioCompra = var_precioCompra, precioVenta = var_precioVenta, 
                            existencias = var_existencias
                        WHERE idProducto = var_idProducto;
    END
$$
DELIMITER ;

-- Stored Procedure para insertar nuevos Accesorios.
DROP PROCEDURE IF EXISTS insertarAccesorio;
DELIMITER $$
CREATE PROCEDURE insertarAccesorio(	/* Datos del Producto */
                                    IN  var_codigoBarrasIn  VARCHAR(48),    --  1
                                    IN	var_nombre          VARCHAR(64),    --  2
                                    IN	var_marca           VARCHAR(64),    --  3
                                    IN	var_precioCompra    DOUBLE,         --  4
                                    IN  var_precioVenta     DOUBLE,         --  5
                                    IN  var_existencias     INT,            --  6
                                    
                                    /* Valores de Retorno */
                                    OUT	var_idProducto      INT,            --  7
                                    OUT	var_idAccesorio     INT,            --  8
                                    OUT	var_codigoBarrasOut VARCHAR(48)     --  9
				)                                    
    BEGIN        
        -- Comenzamos insertando los datos del Producto:
        INSERT INTO producto (nombre, marca, precioCompra, precioVenta, existencias, estatus)
                    VALUES   (var_nombre, var_marca, var_precioCompra, var_precioVenta,
                              var_existencias, 1);
        -- Obtenemos el ID de Producto que se generó:
        SET var_idProducto = LAST_INSERT_ID();

        -- Finalmente, insertamos en la tabla Solucion:
        INSERT INTO accesorio (idProducto)
                    VALUES(var_idProducto);
        -- Obtenemos el ID del Accesorio que se genero:
        SET var_idAccesorio = LAST_INSERT_ID();
        
       -- Generamos su codigo de barras:
        IF var_codigoBarrasIn IS NOT NULL AND var_codigoBarrasIn != '' THEN
            SET var_codigoBarrasOut = var_codigoBarrasIn;
        ELSE
            SET var_codigoBarrasOut = CONCAT('OQ-P', var_idProducto, '-A', var_idAccesorio);
        END IF;
        
        -- Actualizamos el registro:
        UPDATE producto SET codigoBarras = var_codigoBarrasOut WHERE idProducto = var_idProducto;
    END
$$
DELIMITER ;

-- Stored Procedure para actualizar datos de Accesorios.
DROP PROCEDURE IF EXISTS actualizarAccesorio;
DELIMITER $$
CREATE PROCEDURE actualizarAccesorio(	/* Datos del Producto */
                                    IN  var_codigoBarras    VARCHAR(48),    --  1
                                    IN	var_nombre          VARCHAR(64),    --  2
                                    IN	var_marca           VARCHAR(64),    --  3
                                    IN	var_precioCompra    DOUBLE,         --  4
                                    IN  var_precioVenta     DOUBLE,         --  5
                                    IN  var_existencias     INT,            --  6
                                    IN	var_idProducto      INT             --  7                                    
				)                                    
    BEGIN        
        -- Actualizamos los datos del Producto:
        UPDATE producto SET codigoBarras = var_codigoBarras, nombre = var_nombre, marca = var_marca, 
                            precioCompra = var_precioCompra, precioVenta = var_precioVenta, 
                            existencias = var_existencias
                        WHERE idProducto = var_idProducto;
    END
$$
DELIMITER ;

-- Stored Procedure para insertar nuevos Armazones.
DROP PROCEDURE IF EXISTS insertarArmazon;
DELIMITER $$
CREATE PROCEDURE insertarArmazon(	/* Datos del Producto */
                                    IN	var_nombre          VARCHAR(64),    --  1
                                    IN	var_marca           VARCHAR(64),    --  2
                                    IN	var_precioCompra    DOUBLE,         --  3
                                    IN  var_precioVenta     DOUBLE,         --  4
                                    IN  var_existencias     INT,            --  5
                                    
                                    /* Datos del Armazon */
                                    IN  var_modelo          VARCHAR(129),   --  6
                                    IN  var_color           VARCHAR(65),    --  7
                                    IN  var_dimensiones     VARCHAR(33),    --  8
                                    IN  var_descripcion     VARCHAR(255),   --  9
                                    IN  var_fotografia      LONGTEXT,       -- 10
                                    
                                    /* Valores de Retorno */
                                    OUT	var_idProducto      INT,            -- 11
                                    OUT	var_idArmazon       INT,            -- 12
                                    OUT var_codigoBarras    VARCHAR(48)     -- 13
				)                                    
    BEGIN        
        -- Comenzamos insertando los datos del Producto:
        INSERT INTO producto (nombre, marca, precioCompra, precioVenta, existencias, estatus)
                    VALUES   (var_nombre, var_marca, var_precioCompra, var_precioVenta,
                              var_existencias, 1);
        -- Obtenemos el ID de Producto que se generó:
        SET var_idProducto = LAST_INSERT_ID();

        -- Finalmente, insertamos en la tabla Armazon:
        INSERT INTO armazon (idProducto, modelo, color, dimensiones, descripcion, fotografia)
                    VALUES(var_idProducto, var_modelo, var_color, var_dimensiones,
                           var_descripcion, var_fotografia);
        -- Obtenemos el ID del Armazon que se genero:
        SET var_idArmazon = LAST_INSERT_ID();
        
        -- Generamos su codigo de barras:
        SET var_codigoBarras = CONCAT('OQ-P', var_idProducto, '-A', var_idArmazon);
        
        -- Actualizamos el registro:
        UPDATE producto SET codigoBarras = var_codigoBarras WHERE idProducto = var_idProducto;
    END
$$
DELIMITER ;

-- Stored Procedure para actualizar datos de Armazones.
DROP PROCEDURE IF EXISTS actualizarArmazon;
DELIMITER $$
CREATE PROCEDURE actualizarArmazon(	/* Datos del Producto */
                                    IN	var_nombre          VARCHAR(64),    --  1
                                    IN	var_marca           VARCHAR(64),    --  2
                                    IN	var_precioCompra    DOUBLE,         --  3
                                    IN  var_precioVenta     DOUBLE,         --  4
                                    IN  var_existencias     INT,            --  5
                                    
                                    /* Datos del Armazon */
                                    IN  var_modelo          VARCHAR(129),   --  6
                                    IN  var_color           VARCHAR(65),    --  7
                                    IN  var_dimensiones     VARCHAR(33),    --  8
                                    IN  var_descripcion     VARCHAR(255),   --  9
                                    IN  var_fotografia      LONGTEXT,       -- 10

                                    /* IDs */
                                    IN	var_idProducto      INT,            -- 11
                                    IN	var_idArmazon       INT             -- 12
				)                                    
    BEGIN        
        -- Actualizamos los datos del Producto:
        UPDATE producto SET nombre = var_nombre, marca = var_marca, 
                            precioCompra = var_precioCompra, precioVenta = var_precioVenta, 
                            existencias = var_existencias
                        WHERE idProducto = var_idProducto;
        
        -- Actualizamos los datos del Armazon:
        UPDATE armazon  SET modelo = var_modelo, color = var_color, 
                            dimensiones = var_dimensiones, descripcion = var_descripcion, 
                            fotografia = var_fotografia 
                        WHERE idArmazon = var_idArmazon;
    END
$$
DELIMITER ;

-- Stored Procedure para insertar nuevos Lentes de Contacto.
DROP PROCEDURE IF EXISTS insertarLentesContacto;
DELIMITER $$
CREATE PROCEDURE insertarLenteContacto(	/* Datos del Producto */
                                    IN	var_nombre          VARCHAR(64),    --  1
                                    IN	var_marca           VARCHAR(64),    --  2
                                    IN	var_precioCompra    DOUBLE,         --  3
                                    IN  var_precioVenta     DOUBLE,         --  4
                                    IN  var_existencias     INT,            --  5
                                    
                                    /* Datos del Lente de Contacto */
                                    IN  var_keratometria    INT,   			--  6
                                    IN  var_fotografia      LONGTEXT,       --  7
                                    
                                    /* Valores de Retorno */
                                    OUT	var_idProducto      INT,            --  8
                                    OUT	var_idLenteContacto INT,            --  9
                                    OUT var_codigoBarras    VARCHAR(48)     -- 10
				)                                    
    BEGIN        
        -- Comenzamos insertando los datos del Producto:
        INSERT INTO producto (nombre, marca, precioCompra, precioVenta, existencias, estatus)
                    VALUES   (var_nombre, var_marca, var_precioCompra, var_precioVenta,
                              var_existencias, 1);
        -- Obtenemos el ID de Producto que se generó:
        SET var_idProducto = LAST_INSERT_ID();

        -- Finalmente, insertamos en la tabla Lente de Contacto:
        INSERT INTO lente_contacto (idProducto, keratometria, fotografia)
                    VALUES(var_idProducto, var_keratometria, var_fotografia);
        -- Obtenemos el ID del Lente de Contacto que se genero:
        SET var_idLenteContacto = LAST_INSERT_ID();
        
        -- Generamos su codigo de barras:
        SET var_codigoBarras = CONCAT('OQ-P', var_idProducto, '-L', var_idLenteContacto);
        
        -- Actualizamos el registro:
        UPDATE producto SET codigoBarras = var_codigoBarras WHERE idProducto = var_idProducto;
    END
$$
DELIMITER ;


-- Stored Procedure para actualizar datos de Lentes de contacto.
DROP PROCEDURE IF EXISTS actualizarLenteContacto;
DELIMITER $$
CREATE PROCEDURE actualizarLenteContacto(	/* Datos del Producto */
                                    IN	var_nombre          VARCHAR(64),    --  1
                                    IN	var_marca           VARCHAR(64),    --  2
                                    IN	var_precioCompra    DOUBLE,         --  3
                                    IN  var_precioVenta     DOUBLE,         --  4
                                    IN  var_existencias     INT,            --  5
                                    
                                    /* Datos del Lente de Contacto */
                                    IN  var_keratometria    INT,   			--  6
                                    IN  var_fotografia      LONGTEXT,       --  7

                                    /* IDs */
                                    IN	var_idProducto      INT,            --  8
                                    IN	var_idLenteContacto      INT             --  9
				)                                    
    BEGIN        
        -- Actualizamos los datos del Producto:
        UPDATE producto SET nombre = var_nombre, marca = var_marca, 
                            precioCompra = var_precioCompra, precioVenta = var_precioVenta, 
                            existencias = var_existencias
                        WHERE idProducto = var_idProducto;
        
        -- Actualizamos los datos del Lentes de Contacto:
        UPDATE lente_contacto  SET keratometria = var_keratometria, 
                            fotografia = var_fotografia 
                        WHERE idLenteContacto = var_idLenteContacto;
    END
$$
DELIMITER ;

-- Stored Procedure para insertar registros de examenes de la vista.
DROP PROCEDURE IF EXISTS insertarExamenVista;
DELIMITER $$
CREATE PROCEDURE insertarExamenVista(   /* Datos de la Graduacion */
                                        IN  var_esferaod    DOUBLE,         --  1 
                                        IN  var_esferaoi    DOUBLE,         --  2
                                        IN  var_cilindrood  INT,            --  3
                                        IN  var_cilindrooi  INT,            --  4
                                        IN  var_ejeod       INT,            --  5
                                        IN  var_ejeoi       INT,            --  6
                                        IN  var_dip         VARCHAR(13),    --  7
                                        
                                        /* ID del Empleado */
                                        IN var_idEmpleado   INT,            --  8
                                        
                                        /* ID del Cliente */
                                        IN  var_idCliente   INT,            --  9
                                        
                                        /* Parametros de Salida */
                                        OUT var_idExamenVista   INT,        -- 10
                                        OUT var_idGraduacion    INT,        -- 11
                                        OUT var_clave           VARCHAR(48),-- 12
                                        OUT var_fecha           TEXT        -- 13
                                    )
    BEGIN  
        DECLARE var_fecha_temp DATETIME;
        SET var_fecha_temp = NOW();
        INSERT INTO graduacion( esferaod, esferaoi, 
                                cilindrood, cilindrooi,
                                ejeod, ejeoi, dip)
                    VALUES(var_esferaod, var_esferaoi,
                           var_cilindrood, var_cilindrooi,
                           var_ejeod, var_ejeoi, var_dip);
        SET var_idGraduacion = LAST_INSERT_ID();
        
        INSERT INTO examen_vista(idEmpleado, idCliente, idGraduacion, fecha)
                    VALUES(var_idEmpleado, var_idCliente, var_idGraduacion, var_fecha_temp);
        SET var_idExamenVista = LAST_INSERT_ID();
        SET var_fecha = DATE_FORMAT(var_fecha_temp, '%d/%m/%Y %H:%i');            
        SET var_clave = MD5(CONCAT('OQEV-', var_idExamenVista, '-', CAST(UNIX_TIMESTAMP() AS CHAR)));
        
        UPDATE examen_vista SET clave = var_clave WHERE idExamenVista = var_idExamenVista;
    END
$$
DELIMITER ;

-- Stored Procedure para insertar registros de examenes de la vista.
DROP PROCEDURE IF EXISTS actualizarExamenVista;
DELIMITER $$
CREATE PROCEDURE actualizarExamenVista(   /* Datos de la Graduacion */
                                        IN  var_esferaod    DOUBLE,         --  1 
                                        IN  var_esferaoi    DOUBLE,         --  2
                                        IN  var_cilindrood  INT,            --  3
                                        IN  var_cilindrooi  INT,            --  4
                                        IN  var_ejeod       INT,            --  5
                                        IN  var_ejeoi       INT,            --  6
                                        IN  var_dip         VARCHAR(13),    --  7
                                        
                                        /* IDs */
                                        IN  var_idGraduacion   INT          --  8                                        
                                    )
    BEGIN  
        UPDATE graduacion SET   esferaod = var_esferaod, esferaoi = var_esferaoi,
                                cilindrood = var_cilindrood, cilindrooi = var_cilindrooi,
                                ejeod = var_ejeod, ejeoi = var_ejeoi,
                                dip = var_dip
        WHERE idGraduacion = var_idGraduacion;
    END
$$
DELIMITER ;

-- Stored Procedure para generar nuevos tokens de Empleados.
DROP PROCEDURE IF EXISTS generarNuevoTokenEmpleado;
DELIMITER $$
CREATE PROCEDURE generarNuevoTokenEmpleado(IN  var_idUsuario INT, 
                                           OUT var_lastToken VARCHAR(65), 
                                           OUT var_dateLastToken VARCHAR(25))
    BEGIN        
        -- Comenzamos generando el nuevo Token:        
        SET var_lastToken = MD5(CONCAT('UUID-', var_idUsuario, '-', CAST(UNIX_TIMESTAMP() AS CHAR)));
        
        -- Actualizamos la tabla de usuarios:
        SET var_dateLastToken = NOW();
        UPDATE usuario SET lastToken = var_lastToken, dateLastToken = var_dateLastToken WHERE idUsuario = var_idUsuario;
    END
$$
DELIMITER ;


###################################################################
######################## ELIMINAR #################################


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