const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Control = require('../models/votingControl');

// =======================================
// Obtener Control de Votos
// =======================================
app.get('/controlVotos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Control.find({ status: true })
        .skip(desde)
        .limit(5)
        .exec((err, controls) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de controles de votacion',
                    err
                });
            }

            Control.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    controls,
                    total: cont
                });

            });

        })
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
        candidate: body.candidate,
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
        control.candidate = body.candidate;
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
// Cerrar un Control de Votos
// =======================================
app.delete('/controlVotos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        is_closed: true
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