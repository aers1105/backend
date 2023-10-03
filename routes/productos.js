const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares/');
const { crearProducto,
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos');

const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const router = Router();




// Obtener todos los productos - Publico.
router.get('/', obtenerProductos);

// Obtener un producto por id - Publico.
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto);

// Crear producto - Privado con cualquier rol.
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

// Actualizar un registro - Privado con cualquier token válido.
router.put('/:id', [
    validarJWT,
    check('id').custom(existeProducto), 
    validarCampos
], actualizarProducto);

// Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id', '').custom(existeProducto),
    validarCampos
], borrarProducto);





module.exports = router;