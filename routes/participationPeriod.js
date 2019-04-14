const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Period = require('../models/participationPeriod');

// =======================================
// Obtener Periodos de Participacion
// =======================================
app.get('/periodos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Period.find({ status: true })
        .skip(desde)
        .limit(5)
        .exec((err, periods) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de periodos de participacion',
                    err
                });
            }

            Period.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    periods,
                    total: cont
                });

            });

        })
});


// =======================================
// Crear Periodos de Participacion
// =======================================
app.post('/periodos', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let period = new Period({
        period: body.period,
        year: body.year,
        dateVoting: body.dateVoting
    });

    period.save((err, periodDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un periodo de participacion',
                err
            });
        }

        res.status(201).json({
            ok: true,
            period: periodDB
        });

    });

});

// =======================================
// Actualizar Periodos de Participacion
// =======================================
app.put('/periodos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Period.findById(id, (err, period) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un periodo de participacion',
                err
            });
        }

        if (!period) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El periodo de participacion con el id ' + id + ' no existe'
            });
        }

        period.period = body.period;
        period.year = body.year;
        period.dateVoting = body.dateVoting;

        period.save((err, periodDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un periodo de participacion',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                period: periodDB
            });

        });
    });

});

// =======================================
// Eliminar Periodos de Participacion
// =======================================
app.delete('/periodos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    Period.findByIdAndUpdate(id, deleted, { new: true }, (err, periodDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un periodo de participacion',
                err
            });
        }

        if (!periodDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Periodo de participacion no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            period: periodDB
        });

    });

});

module.exports = app;