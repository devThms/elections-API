const jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;

// =======================================
// Verificacion de Token
// =======================================

exports.verificaToken = function(req, res, next) {

    let token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no autorizado',
                err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });


}