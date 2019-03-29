const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;

const app = express();

let Usuario = require('../models/usuario');

// ========================================
// Login de Usuarios
// ========================================
app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error login de usuarios',
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                err
            });
        }

        // Generación de JWT
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 Horas de vigencia Token

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        });

    });



});

module.exports = app;