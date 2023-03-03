-- ---------------------------------------------------------------- --
-- Archivo: 04_DatosBase_Optica.sql                                 -- 
-- Version: 1.0                                                     --
-- Autor:   Miguel Angel Gil Rios   								--
-- Email:   angel.grios@gmail.com / mgil@utleon.edu.mx              --
-- Fecha de elaboracion: 29-12-2021                                 --
-- ---------------------------------------------------------------- --

USE optiqalumnos;

-- Insercion del Usuario Raiz (Administrador):
CALL insertarEmpleado('Administrador', '-', '-', 'O', '31/01/1997', -- Datos Personales
                      '', '', '', '', '', '', '', '', '',
                      'Administrador', '', 'Administrador',         -- Datos de Seguridad
                      @out1, @out2, @out3, @out4, @out5); -- Parametros de salida
                      
-- Insercion de Catalogos Base
INSERT INTO tipo_mica(idTipoMica, nombre, precioCompra, precioVenta) 
             VALUES (1, 'Bifocal', 0.00, 0.00),
                    (2, 'Monofocal', 0.00, 0.00),
                    (3, 'Progresivo', 0.00, 0.00);
                    
INSERT INTO material(idMaterial, nombre, precioCompra, precioVenta)
            VALUES  (1, 'Cr', 0.00, 0.00),
                    (2, 'Cristal', 0.00, 0.00),
                    (3, 'Polarizado', 0.00, 0.00),
                    (4, 'Policarbonato', 0.00, 0.00);
                    
INSERT INTO tratamiento (idTratamiento, nombre, precioCompra, precioVenta, estatus)
            VALUES      (1, 'Antireflejante básico', 0.00, 0.00, 1),
                        (2, 'Blue free', 0.00, 0.00, 1),
                        (3, 'Entintado', 0.00, 0.00, 1),
                        (4, 'Fotocromático', 0.00, 0.00, 1);