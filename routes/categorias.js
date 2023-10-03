const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares/');
const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();




// Obtener todas las categorias - Publico.
router.get('/', obtenerCategorias);

// Obtener una categoria por id - Publico.
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id', 'No se encontró ninguna categoria con ese id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

// Crear categoria - Privado con cualquier rol.
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar un registro - Privado con cualquier token válido.
router.put('/:id', [
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', '').custom(existeCategoria),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id', '').custom(existeCategoria),
    validarCampos
], borrarCategoria);





module.exports = router;