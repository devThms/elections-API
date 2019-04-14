const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;

const app = express();

let User = require('../models/user');

// ========================================
// Login de Usuarios
// ========================================
app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error login de usuarios',
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                err
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                err
            });
        }

        // Generación de JWT
        let token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 Horas de vigencia Token

        res.status(200).json({
            ok: true,
            user: userDB,
            token,
            id: userDB._id
        });

    });



});

module.exports = app;