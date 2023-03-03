-- ---------------------------------------------------------------- --
-- Archivo: 03_Vistas_Optica.sql                                    -- 
-- Version: 1.0                                                     --
-- Autor:   Miguel Angel Gil Rios   								--
-- Email:   angel.grios@gmail.com / mgil@utleon.edu.mx              --
-- Fecha de elaboracion: 06-01-2022                                 --
-- ---------------------------------------------------------------- --

USE optiqalumnos;

-- Vista que obtiene todos los datos de los Empleados:
DROP VIEW IF EXISTS v_empleados;
CREATE VIEW v_empleados AS
    SELECT  P.idPersona,
            P.nombre,
            P.apellidoPaterno,
            P.apellidoMaterno,
            P.genero,
            DATE_FORMAT(P.fechaNacimiento, '%d/%m/%Y') AS fechaNacimiento,
            P.calle,
            P.numero,
            P.colonia,
            P.cp,
            P.ciudad,
            P.estado, 
            P.telcasa,
            P.telmovil,
            P.email,
            E.idEmpleado,
            E.numeroUnico,
            E.estatus,
            U.idUsuario,
			U.nombre AS nombreUsuario,
			U.contrasenia,
			U.rol,
            U.lastToken,
            DATE_FORMAT(U.dateLastToken, '%d/%m/%Y %H:%i:%S') AS dateLastToken
    FROM    persona P
            INNER JOIN empleado E ON E.idPersona = P.idPersona
            INNER JOIN usuario U ON U.idUsuario = E.idUsuario;



-- Vista que obtiene todos los datos de los Clientes:
DROP VIEW IF EXISTS v_clientes;
CREATE VIEW v_clientes AS
    SELECT  P.idPersona,
            P.nombre,
            P.apellidoPaterno,
            P.apellidoMaterno,
            P.genero,
            DATE_FORMAT(P.fechaNacimiento, '%d/%m/%Y') AS fechaNacimiento,
            P.calle,
            P.numero,
            P.colonia,
            P.cp,
            P.ciudad,
            P.estado, 
            P.telcasa,
            P.telmovil,
            P.email,
            C.idCliente,
            C.numeroUnico,
            C.estatus
    FROM    persona P
            INNER JOIN cliente C ON C.idPersona = P.idPersona;
            
-- Vista que obtiene los examenes de la vista realizados
-- con los datos de la graduacion de lentes requerida y
-- los datos del cliente a quien se le practicó:
DROP VIEW IF EXISTS v_examenvista_cliente;
CREATE VIEW v_examenvista_cliente AS
    SELECT  EV.idExamenVista,
            EV.clave,
            DATE_FORMAT(EV.fecha, '%d/%m/%Y %H:%i') AS fecha,
            G.*,
            E.idEmpleado,
            E.numeroUnico AS numeroUnicoEmpleado,
            PE.idPersona AS idPersonaEmpleado,
            PE.nombre AS nombreEmpleado,
            PE.apellidoPaterno AS apellidoPaternoEmpleado,
            PE.apellidoMaterno AS apellidoMaternoEmpleado,
            C.idCliente,
            C.numeroUnico AS numeroUnicoCliente,
            PC.idPersona AS idPersonaCliente,
            PC.nombre AS nombreCliente,
            PC.apellidoPaterno AS apellidoPaternoCliente,
            PC.apellidoMaterno AS apellidoMaternoCliente
    FROM    examen_vista EV 
            INNER JOIN graduacion G ON EV.idGraduacion = G.idGraduacion 
            INNER JOIN cliente C ON EV.idCliente = C.idCliente
            INNER JOIN empleado E ON E.idEmpleado = EV.idEmpleado
            INNER JOIN persona PE ON E.idPersona = PE.idPersona
            INNER JOIN persona PC ON C.idPersona = PC.idPersona;
            

-- Vista que obtiene todos los datos de los Accesorios:
DROP VIEW IF EXISTS v_accesorios;
CREATE VIEW v_accesorios AS
    SELECT  A.idAccesorio,
            P.*         
    FROM    accesorio A
            INNER JOIN producto P ON A.idProducto = P.idProducto;
            
-- Vista que obtiene todos los datos de los Armazones:
DROP VIEW IF EXISTS v_armazones;
CREATE VIEW v_armazones AS
    SELECT  A.idArmazon,
            A.modelo,
            A.color,
            A.dimensiones,
            A.descripcion,            
            A.fotografia,
            P.*         
    FROM    armazon A
            INNER JOIN producto P ON A.idProducto = P.idProducto;
  
-- Vista que obtiene todos los datos de los Lentes de Contacto:  
DROP VIEW IF EXISTS v_lentes_contacto;
CREATE VIEW v_lentes_contacto AS
    SELECT  LC.idLenteContacto,
            LC.keratometria,
            LC.fotografia,
            P.*         
    FROM    lente_contacto LC
            INNER JOIN producto P ON LC.idProducto = P.idProducto;

-- Vista que obtiene todos los datos de las Soluciones:  
DROP VIEW IF EXISTS v_soluciones;
CREATE VIEW v_soluciones AS
    SELECT  S.idSolucion,
            P.*         
    FROM    solucion S
            INNER JOIN producto P ON S.idProducto = P.idProducto;