const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Political = require('../models/politicalParty');

// =======================================
// Obtener Partidos Politicos
// =======================================
app.get('/partidos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Political.find({ status: true })
        .skip(desde)
        .limit(5)
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
// Crear Partidos Politicos
// =======================================
app.post('/partidos', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let political = new Political({
        name: body.name,
        address: body.address,
        phone: body.phone,
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