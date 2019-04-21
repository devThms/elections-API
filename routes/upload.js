const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

// default options
app.use(fileUpload());

// Importar los modelos de las colecciones
let Usuario = require('../models/user');
let Candidato = require('../models/candidate');
let Partido = require('../models/politicalParty');

// =======================================
// Subir Imagenes al Servidor
// =======================================
app.put('/upload/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion validos del archivo
    let tiposValidos = ['partidos', 'candidatos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válido',
            err: { message: 'Los tipos de colección validas son: ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al cargar un archivo',
            err: { message: 'Debe seleccionar una imagen valida' }
        });
    }

    // Obtener el nombre del archivo
    let archivo = req.files.imagen;
    let arrayArchivo = archivo.name.split('.');
    let extArchivo = arrayArchivo[arrayArchivo.length - 1];

    // Extensiones validas del archivo
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            err: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre personalizado del archivo
    // 3738483400394-960.extension
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extArchivo }`;

    // Mover el archivo a un path especifico del servidor
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                err
            });
        }

        subirImagen(tipo, id, nombreArchivo, res);

    });

});

// Function para subir imagen por tipo de colección en la BD
function subirImagen(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuarioDB) => {

            let pathAnterior = './uploads/usuarios/' + usuarioDB.img;

            // Eliminar imagen anterior, si el usuario ya tenia asignada
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, err => {
                    if (err) throw err;
                });
            }

            usuarioDB.img = nombreArchivo;

            usuarioDB.save((err, usuarioActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioActualizado
                });

            });

        });

    }

    if (tipo === 'candidatos') {

        Candidato.findById(id, (err, candidatoDB) => {

            let pathAnterior = './uploads/candidatos/' + candidatoDB.img;

            // Eliminar imagen anterior, si el usuario ya tenia asignada
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, err => {
                    if (err) throw err;
                });
            }

            candidatoDB.img = nombreArchivo;

            candidatoDB.save((err, candidatoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de candidato actualizada',
                    candidatoActualizado
                });

            });

        });

    }

    if (tipo === 'partidos') {

        Partido.findById(id, (err, partidoDB) => {

            let pathAnterior = './uploads/partidos/' + partidoDB.logotype;

            // Eliminar imagen anterior, si el usuario ya tenia asignada
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, err => {
                    if (err) throw err;
                });
            }

            partidoDB.logotype = nombreArchivo;

            partidoDB.save((err, partidoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de partido politico actualizada',
                    partidoActualizado
                });

            });

        });


    }
}


module.exports = app;