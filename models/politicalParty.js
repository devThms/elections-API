const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let politicalSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    address: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    phone: {
        type: String,
        required: [true, 'El numero de telefono es bligatorio']
    },
    foundation: {
        type: String,
        required: [true, 'Es requerido indicar su fundacion']
    },
    color: {
        type: String,
        required: [true, 'Es requerido indicar el color hexadecimal del partido']
    },
    logotype: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }

}, { collection: 'politicalParties' });

module.exports = mongoose.model('Political', politicalSchema);