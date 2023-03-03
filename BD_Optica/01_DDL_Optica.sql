-- ---------------------------------------------------------------- --
-- Archivo: 01_DDL_Optica.sql                                       -- 
-- Version: 1.0                                                     --
-- Autor:   Miguel Angel Gil Rios   								--
-- Email:   angel.grios@gmail.com / mgil@utleon.edu.mx              --
-- Fecha de elaboracion: 20-12-2021                                 --
-- ---------------------------------------------------------------- --
DROP DATABASE IF EXISTS optiqalumnos;
CREATE DATABASE optiqalumnos;

USE optiqalumnos;

-- ------------- TABLA USUARIO -------------- --
CREATE TABLE usuario (
	idUsuario           INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre              VARCHAR(129) UNIQUE NOT NULL,
    contrasenia         VARCHAR(129) NOT NULL,
    rol                 VARCHAR(25) NOT NULL DEFAULT 'Empleado', -- Rol: Administrador; Empleado;
    lastToken           VARCHAR(65) NOT NULL DEFAULT '', -- Esto es para la seguridad de los servicios
    dateLastToken       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP -- STR_TO_DATE('01/01/1901 00:00:00', '%d/%m/%Y %H:%i:%S')
);

-- ------------- TABLA PERSONA -------------- --
CREATE TABLE persona (
	idPersona 			INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre 				VARCHAR(50) NOT NULL,
	apellidoPaterno 	VARCHAR(40) NOT NULL,
	apellidoMaterno 	VARCHAR(40) NOT NULL DEFAULT '',
    genero              VARCHAR(2) NOT NULL DEFAULT 'O', -- Genero: M; F; O;
	fechaNacimiento 	DATE NOT NULL,
	calle 				VARCHAR(129) NOT NULL DEFAULT '',
	numero 				VARCHAR(20)  NOT NULL DEFAULT '',
	colonia 			VARCHAR(40) NOT NULL DEFAULT '',
	cp 					VARCHAR(25) NOT NULL DEFAULT '', -- Aunque el CP es un numero, se maneja como cadena por la internacionalización
	ciudad 				VARCHAR(40) NOT NULL DEFAULT '',
	estado 				VARCHAR(40) NOT NULL DEFAULT '',
	telcasa             VARCHAR(20) NOT NULL DEFAULT '',
	telmovil            VARCHAR(20) NOT NULL DEFAULT '',
    email               VARCHAR(129) NOT NULL DEFAULT ''
);

-- ------------- TABLA CLIENTE -------------- --
CREATE TABLE cliente (
    idCliente			INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idPersona			INT NOT NULL,
    numeroUnico         VARCHAR(65) NOT NULL DEFAULT '',
    estatus             INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_cliente_persona FOREIGN KEY (idPersona) 
                REFERENCES persona(idPersona) 
);

-- ------------- TABLA EMPLEADO -------------- --
CREATE TABLE empleado (
    idEmpleado			INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idPersona			INT NOT NULL,
    idUsuario           INT NOT NULL,
    numeroUnico         VARCHAR(65) NOT NULL DEFAULT '',
    estatus             INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_empleado_persona FOREIGN KEY (idPersona) 
                REFERENCES persona(idPersona),
    CONSTRAINT fk_empleado_usuario FOREIGN KEY (idUsuario) 
                REFERENCES usuario(idUsuario)
);

-- ------------- TABLA TIPO_MICA -------------- --
CREATE TABLE tipo_mica (
    idTipoMica          INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre              VARCHAR(129) NOT NULL DEFAULT '',
    precioCompra        DOUBLE NOT NULL DEFAULT 0.0,
    precioVenta         DOUBLE NOT NULL DEFAULT 0.0
);

-- ------------- TABLA MATERIAL -------------- --
CREATE TABLE material (
    idMaterial          INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre              VARCHAR(129) NOT NULL DEFAULT '',
    precioCompra        DOUBLE NOT NULL DEFAULT 0.0,
    precioVenta         DOUBLE NOT NULL DEFAULT 0.0
);

-- ------------- TABLA TRATAMIENTO -------------- --
CREATE TABLE tratamiento (
    idTratamiento       INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre              VARCHAR(129) NOT NULL DEFAULT '',
    precioCompra        DOUBLE NOT NULL DEFAULT 0.0,
    precioVenta         DOUBLE NOT NULL DEFAULT 0.0,
    estatus             INT NOT NULL DEFAULT 1 -- 1: Activo; 0: Inactivo o Eliminado
);

-- ------------- TABLA PRODUCTO -------------- --
CREATE TABLE producto(
    idProducto          INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    codigoBarras        VARCHAR(65) NOT NULL DEFAULT '',
    nombre              VARCHAR(255) NOT NULL,
    marca               VARCHAR(129) NOT NULL,
    precioCompra        DOUBLE NOT NULL DEFAULT 0.0,
    precioVenta         DOUBLE NOT NULL DEFAULT 0.0,
    existencias         INT NOT NULL DEFAULT 1,
    estatus             INT NOT NULL DEFAULT 1 -- 1: Activo; 0: Inactivo o Eliminado
);

-- ------------- TABLA ARMAZON -------------- --
CREATE TABLE armazon(
    idArmazon           INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idProducto          INT NOT NULL,
    modelo              VARCHAR(129) NOT NULL,
    color               VARCHAR(65) NOT NULL,
    dimensiones         VARCHAR(33) NOT NULL,
    descripcion         VARCHAR(255) NOT NULL,
    fotografia          LONGTEXT NOT NULL,
    CONSTRAINT fk_armazon_producto FOREIGN KEY (idProducto) 
                REFERENCES producto(idProducto)
);

-- ------------- TABLA ACCESORIO -------------- --
CREATE TABLE accesorio(
    idAccesorio         INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idProducto          INT NOT NULL,    
    CONSTRAINT fk_accesorio_producto FOREIGN KEY (idProducto) 
                REFERENCES producto(idProducto)
);

-- ------------- TABLA SOLUCION -------------- --
CREATE TABLE solucion(
    idSolucion          INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idProducto          INT NOT NULL,    
    CONSTRAINT fk_solucion_producto FOREIGN KEY (idProducto) 
                REFERENCES producto(idProducto)
);

-- ------------- TABLA GRADUACION -------------- --
CREATE TABLE graduacion(
    idGraduacion        INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    esferaod            DOUBLE NOT NULL DEFAULT 0.0,
    esferaoi            DOUBLE NOT NULL DEFAULT 0.0,
    cilindrood          INT NOT NULL DEFAULT 0.0,
    cilindrooi          INT NOT NULL DEFAULT 0.0,
    ejeoi               INT NOT NULL DEFAULT 0.0,
    ejeod               INT NOT NULL DEFAULT 0.0,
    dip                 VARCHAR(13) NOT NULL DEFAULT '0 / 0' -- Distancia Interpupilar
);

-- ------------- TABLA LENTE_CONTACTO -------------- --
CREATE TABLE lente_contacto(
    idLenteContacto     INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idProducto          INT NOT NULL,
    keratometria        INT NOT NULL DEFAULT 0, -- Se mide en milimicras
    fotografia          LONGTEXT NOT NULL,
    CONSTRAINT fk_lentecontacto_producto FOREIGN KEY (idProducto) 
                REFERENCES producto(idProducto)
);

-- ------------- TABLA EXAMEN_DE_LA_VISTA -------------- --
CREATE TABLE examen_vista(
    idExamenVista       INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    clave               VARCHAR(48) DEFAULT '',
    idEmpleado          INT NOT NULL,
    idCliente           INT NOT NULL,
    idGraduacion        INT NOT NULL,
    fecha               DATETIME NOT NULL, -- Debe ir en formato DD/MM/AAAA HH:MM
    CONSTRAINT fk_examenvista_empleado FOREIGN KEY (idEmpleado) 
                REFERENCES empleado(idEmpleado),
    CONSTRAINT fk_examenvista_cliente FOREIGN KEY (idCliente) 
                REFERENCES cliente(idCliente),
    CONSTRAINT fk_examenvista_graduacion FOREIGN KEY (idGraduacion) 
                REFERENCES graduacion(idGraduacion)
);

-- ------------- TABLA PRESUPUESTO -------------- --
CREATE TABLE presupuesto(
    idPresupuesto       INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idExamenVista       INT NOT NULL, -- Con el examen de la vista llegamos a los datos del cliente
    clave               VARCHAR(65)
);

-- ------------- TABLA PRESUPUESTO_LENTES CON ARMAZON -------------- --
CREATE TABLE presupuesto_lentes(
    idPresupuestoLentes INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idPresupuesto       INT NOT NULL,    
    alturaOblea         INT NOT NULL DEFAULT 0, -- Medida en milimetros (mm), solo aplica para lentes monofocal y bifocal
    idTipoMica          INT NOT NULL,
    idMaterial          INT NOT NULL,
    idArmazon           INT NOT NULL,
    CONSTRAINT fk_presupuestolentes_presupuesto FOREIGN KEY (idPresupuesto) 
                REFERENCES presupuesto(idPresupuesto),
    CONSTRAINT fk_presupuestolentes_tipomica FOREIGN KEY (idTipoMica) 
                REFERENCES tipo_mica(idTipoMica),
    CONSTRAINT fk_presupuestolentes_material FOREIGN KEY (idMaterial) 
                REFERENCES material(idMaterial),
    CONSTRAINT fk_presupuestolentes_armazon FOREIGN KEY (idArmazon) 
                REFERENCES armazon(idArmazon)
    -- El total del presupuesto no se considera porque es un campo calculado.
);

-- ------------- TABLA PRESUPUESTO_TRATAMIENTOS -------------- --
CREATE TABLE presupuesto_lentes_tratamientos(
    idPresupuestoLentes INT NOT NULL,
    idTratamiento       INT NOT NULL,
    CONSTRAINT fk_presupuesto_presupuestolentes FOREIGN KEY (idPresupuestoLentes) 
                REFERENCES presupuesto_lentes(idPresupuestoLentes),
    CONSTRAINT fk_presupuesto_tratamiento FOREIGN KEY (idTratamiento) 
                REFERENCES tratamiento(idTratamiento)
);

-- ------------- TABLA PRESUPUESTO_LENTES DE CONTACTO -------------- --
CREATE TABLE presupuesto_lentescontacto(
    idPresupuestoLentesContacto INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idExamenVista       INT NOT NULL, -- Con el examen de la vista llegamos a los datos del cliente
    idLenteContacto     INT NOT NULL,
    clave               VARCHAR(65),
    CONSTRAINT fk_presupuestolentescontacto_examenvista FOREIGN KEY (idExamenVista) 
                REFERENCES examen_vista(idExamenVista),
    CONSTRAINT fk_presupuestolentescontacto_lentecontacto FOREIGN KEY (idLenteContacto) 
                REFERENCES lente_contacto(idLenteContacto)
                
    -- El total del presupuesto no se considera porque es un campo calculado.
);

CREATE TABLE venta(
    idVenta             INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idEmpleado          INT NOT NULL,
    clave               VARCHAR(69) NOT NULL UNIQUE,
    CONSTRAINT fk_venta_empleado FOREIGN KEY (idEmpleado) 
                REFERENCES empleado(idEmpleado)
    -- El total de la venta y los descuentos no se ponen aquí
    -- porque son campos calculados (3FN).
);

CREATE TABLE venta_presupuesto(
    idVenta             INT NOT NULL,
    idPresupuesto       INT NOT NULL,
    cantidad            INT NOT NULL DEFAULT 1,
    precioUnitario      DOUBLE NOT NULL,
    descuento           DOUBLE NOT NULL,
    -- el subtotal no se pone porque es un campo calculado (3FN).
    CONSTRAINT fk_ventapl_venta FOREIGN KEY (idVenta) 
                REFERENCES venta(idVenta),
    CONSTRAINT fk_venta_presupuesto FOREIGN KEY (idPresupuesto) 
                REFERENCES presupuesto(idPresupuesto)
);

CREATE TABLE venta_producto(
    idVenta             INT NOT NULL,
    idProducto          INT NOT NULL,
    cantidad            INT NOT NULL DEFAULT 1,
    precioUnitario      DOUBLE NOT NULL,
    descuento           DOUBLE NOT NULL,
    -- el subtotal no se pone porque es un campo calculado (3FN).
    CONSTRAINT fk_ventasolucion_venta FOREIGN KEY (idVenta) 
                REFERENCES venta(idVenta),
    CONSTRAINT fk_ventaproducto_producto FOREIGN KEY (idProducto) 
                REFERENCES producto(idProducto)
);

CREATE TABLE compra(
    idCompra            INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idEmpleado          INT NOT NULL,
    CONSTRAINT fk_compra_empleado FOREIGN KEY (idEmpleado) 
                REFERENCES empleado(idEmpleado)
    -- El total de la venta y los descuentos no se ponen aquí
    -- porque son campos calculados (3FN).
);

CREATE TABLE compra_producto(
    idCompra            INT NOT NULL,
    idProducto          INT NOT NULL,
    precioUnitario      DOUBLE NOT NULL,
    cantidad            INT NOT NULL,
    CONSTRAINT fk_compraproducto_compra FOREIGN KEY (idCompra) 
                REFERENCES compra(idCompra),
    CONSTRAINT fk_compraproducto_producto FOREIGN KEY (idProducto) 
                REFERENCES producto(idProducto)
);