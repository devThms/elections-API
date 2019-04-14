const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let User = require('../models/user');

// =======================================
// Obtener usuarios
// =======================================
app.get('/usuarios', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    User.find({ status: true }, 'name email img role status')
        .skip(desde)
        .limit(5)
        .exec((err, users) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de usuarios',
                    err
                });
            }

            User.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    users,
                    total: cont
                });

            });


        })
});


// =======================================
// Crear usuarios
// =======================================
app.post('/usuarios', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un usuario',
                err
            });
        }

        res.status(201).json({
            ok: true,
            user: userDB,
            userAuth: req.user
        });

    });

});

// =======================================
// Actualizar usuarios
// =======================================
app.put('/usuarios/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un usuario',
                err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe'
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un usuario',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                user: userDB,
                userAuth: req.user
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
        status: false
    };

    User.findByIdAndUpdate(id, deleted, { new: true }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un usuario',
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            user: userDB,
            userAuth: req.user
        });

    });

});

module.exports = app;