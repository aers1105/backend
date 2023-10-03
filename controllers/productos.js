const { response, request } = require("express")

const { Producto } = require('../models');



const obtenerProductos = async (req = request, resp = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([

        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ])

    resp.json({
        total,
        productos
    });
}

const obtenerProducto = async (req, resp = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    resp.json({ producto })

}

const crearProducto = async (req, resp = response) => {

    const { estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre })

    if (productoDB) {
        return resp.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe en la base de datos.`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = await new Producto(data);

    // Guardar en db
    await producto.save();
    resp.status(201).json(producto);

}

const actualizarProducto = async (req, resp = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    resp.json(producto);

}


const borrarProducto = async (req, resp = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    resp.json(producto);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}