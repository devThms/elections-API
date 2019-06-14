const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let totalVotes = require('../models/votingTotal');

let Profile = require('../models/politicalProfile');

let Center = require('../models/votingCenter');

// ================================================================
// Obtener Totales de Votos por Mesa de Votación y Perfil Politico
// ===============================================================
app.get('/total-votos/:mesaId/:profileId', (req, res) => {

    let mesaId = req.params.mesaId;
    let profileId = req.params.profileId;

    totalVotes.findOne({ table: mesaId, profile: profileId, status: true })
        .populate('user', 'name')
        .populate('table', 'localNumber nationalNumber')
        .populate('profile', 'name')
        .populate('center', 'name ubication qtyTables')
        .exec((err, votes) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de totales de votacion',
                    err
                });
            }

            totalVotes.count({ table: mesaId, profile: profileId, status: true }, (err, cont) => {

                res.status(200).json({
                    ok: true,
                    votes,
                    total: cont
                });

            });

        })
});

// ==============================================================================
// Obtener Total de Votos por Perfil Politico y Centro de Votación -- Dashboard
// ==============================================================================
app.get('/total-votos-centro/:profileId/:centerId', (req, res) => {

    let profileId = req.params.profileId;
    let centerId = req.params.centerId;

    Profile.findById(profileId, (err, profileDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error debe seleccionar primero un perfil valido',
                err
            });
        }

        Center.findById(centerId, (err, centerDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar un centro de votación valido',
                    err
                });
            }

            totalVotes.aggregate([{
                    $match: { $and: [{ profile: profileDB._id }, { center: centerDB._id }] }
                },
                {
                    $group: {
                        _id: { profile: "$profile", center: "$center" },
                        votosValidos: { $sum: "$validVotes" },
                        votosNulos: { $sum: "$nullVotes" },
                        votosBlancos: { $sum: "$blankVotes" },
                        votosImpugnacion: { $sum: "$objectionVotes" },
                        count: { $sum: 1 }
                    }
                }
            ]).exec((err, votes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error carga de totales de votacion',
                        err
                    });
                } else {
                    return res.status(200).json({
                        ok: true,
                        totalVotos: votes
                    });
                }
            });


        });



    });



});


// ==============================================================================
// Obtener Total de Votos por Perfil Politico -- Dashboard
// ==============================================================================
app.get('/total-votos-perfil/:profileId', (req, res) => {

    let profileId = req.params.profileId;

    Profile.findById(profileId, (err, profileDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error debe seleccionar primero un perfil valido',
                err
            });
        }

        totalVotes.aggregate([{
                $match: { profile: profileDB._id }
            },
            {
                $group: {
                    _id: { profile: "$profile" },
                    votosValidos: { $sum: "$validVotes" },
                    votosNulos: { $sum: "$nullVotes" },
                    votosBlancos: { $sum: "$blankVotes" },
                    votosImpugnacion: { $sum: "$objectionVotes" },
                    count: { $sum: 1 }
                }
            }
        ]).exec((err, votes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carga de controles de votacion',
                    err
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    totalVotos: votes
                });
            }
        });


    });



});


// =======================================
// Crear Total de Votos
// =======================================
app.post('/total-votos', mdAuth.verificaToken, (req, res) => {

    let body = req.body;

    let totalvotes = new totalVotes({
        validVotes: body.validVotes,
        nullVotes: body.nullVotes,
        blankVotes: body.blankVotes,
        objectionVotes: body.objectionVotes,
        user: body.user,
        table: body.table,
        profile: body.profile,
        center: body.center
    });

    totalvotes.save((err, votesDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un total de votacion',
                err
            });
        }

        res.status(201).json({
            ok: true,
            votes: votesDB
        });



    });

});

// =======================================
// Actualizar Total de Votos
// =======================================
app.put('/total-votos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    totalVotes.findById(id, (err, votes) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un total de votacion',
                err
            });
        }

        if (!votes) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El total de votacion con el id ' + id + ' no existe'
            });
        }

        votes.validVotes = body.validVotes;
        votes.nullVotes = body.nullVotes;
        votes.blankVotes = body.blankVotes;
        votes.objectionVotes = body.objectionVotes;
        votes.user = body.user;
        votes.table = body.table;
        votes.profile = body.profile;
        votes.center = body.center;

        votes.save((err, votesDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un total de votacion',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                votes: votesDB
            });

        });
    });

});

// =======================================
// Borrar un Total de Votos
// =======================================
app.delete('/total-votos/:id', mdAuth.verificaToken, (req, res) => {

    let id = req.params.id;

    let deleted = {
        status: false
    };

    totalVotes.findByIdAndUpdate(id, deleted, { new: true }, (err, votesDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un total de votacion',
                err
            });
        }

        if (!votesDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Total de votacion no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            votes: votesDB
        });

    });

});

module.exports = app;