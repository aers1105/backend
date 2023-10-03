const { response, request } = require("express")

const { Categoria } = require('../models');


const obtenerCategorias = async (req = request, resp = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([

        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ])

    resp.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req, resp = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    resp.json({ categoria })

}

const crearCategoria = async (req, resp = response) => {

    const nombre = req.body.nombre;

    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return resp.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe en la base de datos.`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = await new Categoria(data);

    // Guardar en db
    await categoria.save();
    resp.status(201).json(categoria);

}

const actualizarCategoria = async (req, resp = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    resp.json(categoria);

}


const borrarCategoria = async (req, resp = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    resp.json(categoria);
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}