#!/usr/bin/env nodejs
 // Requires
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicializar variables
const app = express();

// Habilitación de CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    next();
});

// parser application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexion a la base de datos
mongoose.connection.openUri(process.env.UrlDB, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de Datos online');
})

// Configurando las rutas globales
app.use(require('./routes/routes'));


// Escuchando servicios
app.listen(process.env.PORT, () => {
    console.log(`Express server port ${ process.env.PORT } online`);
});