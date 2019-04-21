const express = require('express');
const fs = require('fs');

const app = express();

// =======================================
// Imagenes del Servidor
// =======================================
app.get('/images/:tipo/:img', (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let path = `./uploads/${ tipo }/${ img }`;

    fs.exists(path, existe => {

        if (!existe) {
            path = './assets/images/no-image.jpg';
        }

        res.sendfile(path);

    });

});

module.exports = app;