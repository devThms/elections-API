const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let centerSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    ubication: {
        type: String,
        required: [true, 'La ubicación es obligatoria']
    },
    qtyTables: {
        type: Number,
        required: [true, 'La cantidad de mesas es obligatoria']
    },
    status: {
        type: Boolean,
        default: true
    }

}, { collection: 'votingCenters' });

module.exports = mongoose.model('Center', centerSchema);