const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Range = require('../models/rangeTable');

// =======================================
// Obtener Rangos de mesas de votacion
// =======================================
app.get('/rangos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Range.find({ status: true })
        .skip(desde)
        .limit(5)
        .populate('center', 'name ubication')
        .exec((err, ranges) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de rangos de mesas de votacion',
                    err
                });
            }

            Range.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    ranges,
                    total: cont
                });

            });

        })
});


// =======================================
// Crear Rangos de mesas de votacion
// =======================================
app.post('/rangos', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let range = new Range({
        initial: body.initial,
        final: body.final,
        center: body.center
    });

    range.save((err, rangeDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un rango de mesas de votacion',
                err
            });
        }

        res.status(201).json({
            ok: true,
            range: rangeDB
        });

    });

});

// =======================================
// Actualizar Rango de mesas de votacion
// =======================================
app.put('/rangos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Range.findById(id, (err, range) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un rango de mesas de votacion',
                err
            });
        }

        if (!range) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El rango de mesas de votacion con el id ' + id + ' no existe'
            });
        }

        range.initial = body.initial;
        range.final = body.final;
        range.center = body.center;

        range.save((err, rangeDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un rango de mesas de votacion',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                range: rangeDB
            });

        });
    });

});

// =======================================
// Eliminar Candidatos
// =======================================
app.delete('/rangos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    Range.findByIdAndUpdate(id, deleted, { new: true }, (err, rangeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un rango de mesas de votacion',
                err
            });
        }

        if (!rangeDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Rango de mesas de votacion no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            range: rangeDB
        });

    });

});

module.exports = app;