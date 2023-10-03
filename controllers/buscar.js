const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
]

const buscarUsuarios = async (termino = '', resp = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return resp.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regexp = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regexp }, { correo: regexp }],
        $and: [{ estado: true }]
    });

    resp.json({
        'total resoults': usuarios.length,
        results: usuarios
    })
}

const buscarCategorias = async (termino = '', resp = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return resp.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regexp = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regexp });

    resp.json({
        'total resoults': categorias.length,
        results: categorias
    })
}


const buscarProductos = async (termino = '', resp = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return resp.json({
            results: (producto) ? [producto] : []
        })
    }

    const regexp = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regexp }).populate('categoria','nombre');

    resp.json({
        'total resoults': productos.length,
        results: productos
    })
}

const buscar = (req, resp = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return resp.status(400).json({
            msg: `Las coleeciones permitidas son: ${coleccionesPermitidas}`
        })

    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, resp);
            break;
        case 'categorias':
            buscarCategorias(termino, resp);
            break;
        case 'productos':
            buscarProductos(termino, resp);
            break;

        default:
            resp.status(500).json({
                msg: 'Olvidé crear esta busqueda'
            })

    }

}


module.exports = {
    buscar
}