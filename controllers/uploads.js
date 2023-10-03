const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, resp = response) => {
    try {

        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        resp.json({ nombre })

    } catch (msg) {
        resp.status(400).json({ msg })
    }
}

const actualizarImagen = async (req, resp = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) return resp.status(400).json({ msg: 'No existe el usuario' })

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) return resp.status(400).json({ msg: 'No existe el producto' })
            break;

        default:
            return resp.status(500).json({ msg: 'Olvidé validar esto xD' })
    }

    // Limpiar imagenes previas
    try {
        if (modelo.img) {
            //Borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }
    } catch (err) {

    }


    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    await modelo.save();

    resp.json({ modelo })

}

const obtenerImagen = async (req, resp = response) => {
    const { coleccion, id } = req.params;

    let modelo;
    let pathNoImage = path.join(__dirname, '../assets/no-image.jpg');
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) return resp.status(400).sendFile(pathNoImage)

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) return resp.status(400).sendFile(pathNoImage)

            break;

        default:
            return resp.status(500).json({ msg: 'Olvidé validar esto xD' })
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        //Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return resp.sendFile(pathImagen);
        }
    }

    return resp.sendFile(pathNoImage);
}

const actualizarImagenCloudinary = async (req, resp = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) return resp.status(400).json({ msg: 'No existe el usuario' })

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) return resp.status(400).json({ msg: 'No existe el producto' })
            break;

        default:
            return resp.status(500).json({ msg: 'Olvidé validar esto xD' })
    }

    // Limpiar imagenes previas

    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }


    const { tempFilePath } = req.files.archivo;
    const { secure_url: url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = url;
    await modelo.save();
    resp.json(url)

}






module.exports = {
    cargarArchivo,
    actualizarImagen,
    obtenerImagen,
    actualizarImagenCloudinary
}