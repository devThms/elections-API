const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Political = require('../models/politicalParty');

// =======================================
// Obtener Partidos Politicos
// =======================================
app.get('/partidos', (req, res) => {

    let desde = req.query.desde || 0;
    let limit = req.query.limit || 5;
    desde = Number(desde);
    limit = Number(limit);

    Political.find({ status: true })
        .skip(desde)
        .limit(limit)
        .exec((err, politicals) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de partidos politicos',
                    err
                });
            }

            Political.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    politicals,
                    total: cont
                });

            });


        })
});

// =======================================
// Buscar Partidos politicos por ID
// =======================================
app.get('/partidos/:id', (req, res) => {

    let id = req.params.id;

    Political.findById(id, (err, politicalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un partido politico',
                err
            });
        }

        if (!politicalDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Partido politico no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            political: politicalDB
        });

    });

});


// =======================================
// Crear Partidos Politicos
// =======================================
app.post('/partidos', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let political = new Political({
        name: body.name,
        address: body.address,
        phone: body.phone,
        color: body.color,
        foundation: body.foundation,
        logotype: body.logotype
    });

    political.save((err, politicalDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un partido politico',
                err
            });
        }

        res.status(201).json({
            ok: true,
            political: politicalDB
        });

    });

});

// =======================================
// Actualizar Partidos Politicos
// =======================================
app.put('/partidos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Political.findById(id, (err, political) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un partido politico',
                err
            });
        }

        if (!political) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El partido politico con el id ' + id + ' no existe'
            });
        }

        political.name = body.name;
        political.address = body.address;
        political.phone = body.phone;
        political.color = body.color;
        political.foundation = body.foundation;

        political.save((err, politicalDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un partido politico',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                political: politicalDB
            });

        });
    });

});

// =======================================
// Eliminar Partidos politicos
// =======================================
app.delete('/partidos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    Political.findByIdAndUpdate(id, deleted, { new: true }, (err, politicalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un partido politico',
                err
            });
        }

        if (!politicalDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Partido politico no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            political: politicalDB
        });

    });

});

module.exports = app;