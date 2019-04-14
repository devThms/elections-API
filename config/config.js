// ===============================
// Semilla secreta del JWT
// ===============================
module.exports.SEED = 'seed-secret';

// ===============================
// Puerto
// ===============================
process.env.PORT = process.env.PORT || 3000;

// ===============================
// Entorno
// ===============================
process.env.NODE_DEV = process.env.NODE_DEV || 'dev';

// ===============================
// Base de Datos
// ===============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/electionsDB';
} else {
    urlDB = 'mongodb://admin-user:admin123.@ds239936.mlab.com:39936/elections-db';
}
process.env.UrlDB = urlDB;