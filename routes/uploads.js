const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivo } = require('../middlewares');
const { cargarArchivo, actualizarImagen, obtenerImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { validarColeccionesPermitidas } = require('../helpers');



const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], obtenerImagen);

module.exports = router;