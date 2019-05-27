const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Candidate = require('../models/candidate');

// =======================================
// Obtener Candidatos
// =======================================
app.get('/candidatos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Candidate.find({ status: true })
        .skip(desde)
        .limit(5)
        .populate('political', 'name address phone foundation')
        .populate('profile', 'name summary')
        .populate('period', 'period dateVoting')
        .exec((err, candidates) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de candidatos',
                    err
                });
            }

            Candidate.count({ status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    candidates,
                    total: cont
                });

            });

        })
});

// =======================================
// Buscar Candidatos politicos por ID
// =======================================
app.get('/candidatos/:id', (req, res) => {

    let id = req.params.id;

    Candidate.findById(id, (err, candidateDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un candidato politico',
                err
            });
        }

        if (!candidateDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Candidato politico no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            candidate: candidateDB
        });

    });

});

// =======================================
// Crear Candidatos
// =======================================
app.post('/candidatos', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let candidate = new Candidate({
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        phone: body.phone,
        political: body.political,
        profile: body.profile,
        period: body.period
    });

    candidate.save((err, candidateDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un candidato',
                err
            });
        }

        res.status(201).json({
            ok: true,
            candidate: candidateDB
        });

    });

});

// =======================================
// Actualizar Candidatos
// =======================================
app.put('/candidatos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Candidate.findById(id, (err, candidate) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un candidato',
                err
            });
        }

        if (!candidate) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El candidato con el id ' + id + ' no existe'
            });
        }

        candidate.firstName = body.firstName;
        candidate.lastName = body.lastName;
        candidate.address = body.address;
        candidate.phone = body.phone;
        candidate.political = body.political;
        candidate.profile = body.profile;
        candidate.period = body.period;

        candidate.save((err, candidateDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un candidato',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                candidate: candidateDB
            });

        });
    });

});

// =======================================
// Eliminar Candidatos
// =======================================
app.delete('/candidatos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    Candidate.findByIdAndUpdate(id, deleted, { new: true }, (err, candidateDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un candidato',
                err
            });
        }

        if (!candidateDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Candidato no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            candidate: candidateDB
        });

    });

});

module.exports = app;