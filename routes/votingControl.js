const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Control = require('../models/votingControl');

let Profile = require('../models/politicalProfile');

// ==============================================
// Obtener Control de Votos por Mesa de Votación
// ==============================================
app.get('/controlVotos/:mesaId/:profileId', (req, res) => {

    let desde = req.query.desde || 0;
    let mesaId = req.params.mesaId;
    let profileId = req.params.profileId;
    desde = Number(desde);

    Control.find({ table: mesaId, profile: profileId, status: true })
        .skip(desde)
        .populate('user', 'name')
        .populate('table', 'localNumber nationalNumber')
        .populate('profile', 'name')
        .populate('political', 'name address phone')
        .exec((err, controls) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de controles de votacion',
                    err
                });
            }

            Control.count({ table: mesaId, profile: profileId, status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    controls,
                    total: cont
                });

            });

        })
});

// ==============================================================================
// Obtener Control de Votos por Perfil Politico y Centro de Votación -- Dashboard
// ==============================================================================
app.get('/control-votos/:profileId', (req, res) => {

    let id = req.params.profileId;

    Profile.findById(id, (err, profileDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un perfil politico',
                err
            });
        }

        Control.aggregate([{
                $match: { profile: profileDB._id }
            },
            {
                $group: {
                    _id: { political: "$political", profile: "$profile" },
                    totalVotos: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "politicalParties",
                    localField: "_id.political",
                    foreignField: "_id",
                    as: "partidos"
                }
            }
        ]).exec((err, controls) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de controles de votacion',
                    err
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    votosRegistrados: controls
                });
            }
        });


    });



});


// =======================================
// Crear Control de Votos
// =======================================
app.post('/controlVotos', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let control = new Control({
        time: body.time,
        date: body.date,
        user: body.user,
        table: body.table,
        profile: body.profile,
        political: body.political,
        amount: body.amount
    });

    control.save((err, controlDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un control de votacion',
                err
            });
        }

        res.status(201).json({
            ok: true,
            control: controlDB
        });



    });

});

// =======================================
// Actualizar Control de Votos
// =======================================
app.put('/controlVotos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Control.findById(id, (err, control) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un centro de votacion',
                err
            });
        }

        if (!control) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El centro de votacion con el id ' + id + ' no existe'
            });
        }

        control.time = body.time;
        control.date = body.date;
        control.user = body.user;
        control.table = body.table;
        control.profile = body.profile;
        control.political = body.political;
        control.amount = body.amount;

        control.save((err, controlDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un control de votacion',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                control: controlDB
            });

        });
    });

});

// =======================================
// Borrar un Control de Votos
// =======================================
app.delete('/controlVotos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    Control.findByIdAndUpdate(id, deleted, { new: true }, (err, controlDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cerrar un control de votacion',
                err
            });
        }

        if (!controlDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Control de votacion no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            control: controlDB
        });

    });

});

module.exports = app;