const express = require('express');

const app = express();

let mdAuth = require('../middlewares/autenticacion');

let Candidate = require('../models/candidate');
let Political = require('../models/politicalParty');
let Profile = require('../models/politicalProfile');
let User = require('../models/user');
let Center = require('../models/votingCenter');
let Table = require('../models/table');

// =======================================
// Busqueda por colección
// =======================================
app.get('/busqueda/coleccion/:tabla/:termino', (req, res) => {

    let tabla = req.params.tabla;
    let termino = req.params.termino;
    let regEx = RegExp(termino, 'i');

    let promesa;

    switch (tabla) {

        case 'candidatos':
            promesa = buscarCandidatos(regEx);
            break;

        case 'partidos':
            promesa = buscarPartidos(regEx);
            break;

        case 'perfiles':
            promesa = buscarPerfiles(regEx);
            break;

        case 'usuarios':
            promesa = buscarUsuarios(regEx);
            break;

        case 'centros':
            promesa = buscarCentros(regEx);
            break;

        case 'mesas':
            promesa = buscarMesas(termino);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda son: candidatos, partidos, perfiles, usuarios, centros, mesas',
                error: { message: 'Tipo de coleccion no valida' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });

});

// =======================================
// Busqueda General
// =======================================
app.get('/busqueda/todo/:termino', (req, res) => {

    let termino = req.params.termino;
    let regEx = RegExp(termino, 'i');

    Promise.all([
        buscarCandidatos(regEx),
        buscarPartidos(regEx),
        buscarPerfiles(regEx),
        buscarUsuarios(regEx),
        buscarCentros(regEx),
        buscarMesas(regEx)
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            candidatos: respuestas[0],
            partidos: respuestas[1],
            perfiles: respuestas[2],
            usuarios: respuestas[3],
            centros: respuestas[4],
            mesas: respuestas[5]
        });

    });

});

function buscarCandidatos(regEx) {

    return new Promise((resolve, reject) => {

        Candidate.find({ status: true })
            .or([{ 'firstName': regEx }, { 'lastName': regEx }, { 'profile.name': regEx }])
            .populate('political', 'name address phone foundation')
            .populate('profile', 'name summary')
            .populate('period', 'period dateVoting')
            .exec((err, candidatos) => {

                if (err) {
                    reject('Error al cargar candidatos', err);
                } else {
                    resolve(candidatos);
                }

            });

    });
}

function buscarPartidos(regEx) {

    return new Promise((resolve, reject) => {

        Political.find({ name: regEx, status: true }, (err, partidos) => {

            if (err) {
                reject('Error al cargar partidos politicos', err);
            } else {
                resolve(partidos);
            }

        });

    });
}

function buscarPerfiles(regEx) {

    return new Promise((resolve, reject) => {

        Profile.find({ name: regEx, status: true }, (err, perfiles) => {

            if (err) {
                reject('Error al cargar perfiles politicos', err);
            } else {
                resolve(perfiles);
            }

        });

    });
}

function buscarUsuarios(regEx) {

    return new Promise((resolve, reject) => {

        User.find({ status: true }, 'name email role')
            .or([{ 'name': regEx }, { 'email': regEx }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });

    });
}

function buscarCentros(regEx) {

    return new Promise((resolve, reject) => {

        Center.find({ name: regEx, status: true }, (err, centros) => {

            if (err) {
                reject('Error al cargar centros de votacion', err);
            } else {
                resolve(centros);
            }

        });

    });
}

function buscarMesas(termino) {

    return new Promise((resolve, reject) => {

        Table.find({ status: true })
            .or([{ 'localNumber': termino }, { 'nationalNumber': termino }])
            .populate('center', 'name ubication qtyTables')
            .exec((err, mesas) => {

                if (err) {
                    reject('Error al cargar mesas de votacion', err);
                } else {
                    resolve(mesas);
                }

            });

    });
}

module.exports = app;