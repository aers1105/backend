const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const login = async (req, res = response) => {

    const { correo, password } = req.body; correo, password

    try {

        // Verificar si email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) { return res.status(400).json({ msg: 'Usuario no encontrado.' }); }

        // Si el usuario está activo
        if (!usuario.estado) { return res.status(400).json({ msg: 'Usuario dado de baja.' }); }

        // Verificar password
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) { return res.status(400).json({ msg: 'Contraseña incorrecta.' }); }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        
        res.json({
            msg: 'Login OK',
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal.'
        })
    }



}

const googleSignIn = async (req, resp = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data);

            await usuario.save();

        }

        if ( !usuario.estado ) {

            return resp(401).json({
                msg: 'Contacte con el administrador por usuario bloqueado.'
            })

        }


        const token = await generarJWT(usuario.id);


        resp.json({
            usuario,
            token
        })


    } catch (error) {
        resp.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar.'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}