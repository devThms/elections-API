const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Usuario = require('../models/usuario');

// =======================================
// Obtener usuarios
// =======================================
app.get('/usuarios', (req, res) => {

    Usuario.find({ estado: true }, 'nombre email img role estado')
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de usuarios',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                usuarios
            });

        })
});


// =======================================
// Crear usuarios
// =======================================
app.post('/usuarios', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un usuario',
                err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioDB,
            usuarioAuth: req.usuario
        });

    });

});

// =======================================
// Actualizar usuarios
// =======================================
app.put('/usuarios/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un usuario',
                err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe'
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un usuario',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                usuarioAuth: req.usuario
            });

        });
    });

});

// =======================================
// Eliminar usuarios
// =======================================
app.delete('/usuarios/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, deleted, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un usuario',
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            usuarioAuth: req.usuario
        });

    });

});

module.exports = app;