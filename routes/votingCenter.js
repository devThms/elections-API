const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Center = require('../models/votingCenter');

// =======================================
// Obtener Centros de Votacion
// =======================================
app.get('/centros', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Center.find({ status: true })
        .skip(desde)
        .limit(limite)
        .exec((err, centers) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de centros de votacion',
                    err
                });
            }

            Center.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    centers,
                    total: cont
                });

            });

        })
});

// =======================================
// Buscar Centros por ID
// =======================================
app.get('/centros/:id', (req, res) => {

    let id = req.params.id;

    Center.findById(id)
        .exec((err, centerDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar un centro de votación',
                    err
                });
            }

            if (!centerDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Centro de Votación no encontrado'
                });
            }

            res.status(200).json({
                ok: true,
                center: centerDB
            });

        });

});

// =======================================
// Crear Centros de Votacion
// =======================================
app.post('/centros', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let center = new Center({
        name: body.name,
        ubication: body.ubication,
        qtyTables: body.qtyTables
    });

    center.save((err, centerDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un centro de votacion',
                err
            });
        }

        res.status(201).json({
            ok: true,
            center: centerDB
        });

    });

});

// =======================================
// Actualizar Centros de Votacion
// =======================================
app.put('/centros/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Center.findById(id, (err, center) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un centro de votacion',
                err
            });
        }

        if (!center) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El centro de votacion con el id ' + id + ' no existe'
            });
        }

        center.name = body.name;
        center.ubication = body.ubication;
        center.qtyTables = body.qtyTables;

        center.save((err, centerDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un centro de votacion',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                center: centerDB
            });

        });
    });

});

// =======================================
// Eliminar Centros de Votacion
// =======================================
app.delete('/centros/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    Center.findByIdAndUpdate(id, deleted, { new: true }, (err, centerDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un centro de votacion',
                err
            });
        }

        if (!centerDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Centro de votacion no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            center: centerDB
        });

    });

});

module.exports = app;