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

        userDB.password = ';)';

        // Generación de JWT
        let token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 Horas de vigencia Token

        res.status(200).json({
            ok: true,
            user: userDB,
            token,
            id: userDB._id,
            menu: obtenerMenu(userDB.role)
        });

    });



});

function obtenerMenu(ROLE) {

    if (ROLE === 'ADMIN_ROLE') {

        let menuAdmin = [{
                titulo: 'Administracion',
                icono: 'mdi mdi-clipboard-text',
                submenu: [
                    { titulo: 'Usuarios', url: '/usuarios', icono: 'mdi mdi-account-box' }
                ]
            },
            {
                titulo: 'Mantenimientos',
                icono: 'mdi mdi-archive',
                submenu: [
                    { titulo: 'Perfil Politico', url: '/perfiles', icono: 'mdi mdi-account-card-details' },
                    { titulo: 'Periodo', url: '/periodos', icono: 'mdi mdi-timer-sand' },
                    { titulo: 'Partido Politico', url: '/partidos', icono: 'mdi mdi-cards-outline' },
                    { titulo: 'Candidatos', url: '/candidatos', icono: 'mdi mdi-account-multiple' },
                    { titulo: 'Centros de Votación', url: '/centros', icono: 'mdi mdi-bank' }
                ]
            },
            {
                titulo: 'Operaciones',
                icono: 'mdi mdi-book-open-page-variant',
                submenu: [
                    { titulo: 'Registro Votación', url: '/centros-votacion', icono: 'mdi mdi-fingerprint' }
                ]
            }
        ];

        return menuAdmin;

    } else {

        let menuOperator = [{
            titulo: 'Operaciones',
            icono: 'mdi mdi-book-open-page-variant',
            submenu: [
                { titulo: 'Registro Votación', url: '/centros-votacion', icono: 'mdi mdi-fingerprint' }
            ]
        }];

        return menuOperator;

    }

}

module.exports = app;