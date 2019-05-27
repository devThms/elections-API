const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Profile = require('../models/politicalProfile');

// =======================================
// Obtener Perfiles Politicos
// =======================================
app.get('/perfiles', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Profile.find({ status: true })
        .skip(desde)
        .limit(5)
        .exec((err, profiles) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de perfiles politicos',
                    err
                });
            }

            Profile.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    profiles,
                    total: cont
                });

            });


        })
});

// =======================================
// Buscar Perfiles politicos por ID
// =======================================
app.get('/perfiles/:id', (req, res) => {

    let id = req.params.id;

    Profile.findById(id, (err, profileDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un perfil politico',
                err
            });
        }

        if (!profileDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Perfil politico no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            profile: profileDB
        });

    });

});

// =======================================
// Crear Perfiles Politicos
// =======================================
app.post('/perfiles', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let profile = new Profile({
        name: body.name,
        summary: body.summary
    });

    profile.save((err, profileDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un perfil politico',
                err
            });
        }

        res.status(201).json({
            ok: true,
            profile: profileDB
        });

    });

});

// =======================================
// Actualizar Perfiles Politicos
// =======================================
app.put('/perfiles/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Profile.findById(id, (err, profile) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un perfil politico',
                err
            });
        }

        if (!profile) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El perfil politico con el id ' + id + ' no existe'
            });
        }

        profile.name = body.name;
        profile.summary = body.summary;

        profile.save((err, profileDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un perfil politico',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                profile: profileDB
            });

        });
    });

});

// =======================================
// Eliminar Perfiles politicos
// =======================================
app.delete('/perfiles/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    Profile.findByIdAndUpdate(id, deleted, { new: true }, (err, profileDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un perfil politico',
                err
            });
        }

        if (!profileDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Perfil politico no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            profile: profileDB
        });

    });

});

module.exports = app;