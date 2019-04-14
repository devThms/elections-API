const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Table = require('../models/table');

// =======================================
// Obtener Mesas de Votacion
// =======================================
app.get('/mesas', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Table.find({ status: true })
        .skip(desde)
        .limit(5)
        .populate('center', 'name ubication')
        .exec((err, tables) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de mesas de votacion',
                    err
                });
            }

            Table.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    tables,
                    total: cont
                });

            });

        })
});


// =======================================
// Crear Mesas de Votacion
// =======================================
app.post('/mesas', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let table = new Table({
        localNumber: body.localNumber,
        nationalNumber: body.nationalNumber,
        center: body.center
    });

    table.save((err, tableDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear una mesa de votacion',
                err
            });
        }

        res.status(201).json({
            ok: true,
            table: tableDB
        });

    });

});

// =======================================
// Actualizar Mesas de Votacion
// =======================================
app.put('/mesas/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Table.findById(id, (err, table) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar una mesa de votacion',
                err
            });
        }

        if (!table) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La mesa de votacion con el id ' + id + ' no existe'
            });
        }

        table.localNumber = body.localNumber;
        table.nationalNumber = body.nationalNumber;
        table.center = body.center;

        table.save((err, tableDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar una mesa de votacion',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                table: tableDB
            });

        });
    });

});

// =======================================
// Eliminar Mesas de Votacion
// =======================================
app.delete('/mesas/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    Table.findByIdAndUpdate(id, deleted, { new: true }, (err, tableDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar una mesa de votacion',
                err
            });
        }

        if (!tableDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Mesa de votacion no encontrada'
            });
        }

        res.status(200).json({
            ok: true,
            table: tableDB
        });

    });

});

module.exports = app;