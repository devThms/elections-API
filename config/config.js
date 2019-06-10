// ===============================
// Semilla secreta del JWT
// ===============================
module.exports.SEED = 'seed-secret';

// ===============================
// Configuracion Puerto
// ===============================
process.env.PORT = process.env.PORT || 80;

// ===============================
// Configuracion Entorno
// ===============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============================
// Configuracion Base de Datos
// ===============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/electionsDB';
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.UrlDB = urlDB;