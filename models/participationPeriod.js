const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let periodSchema = new Schema({

    period: {
        type: String,
        required: [true, 'El periodo es obligatorio']
    },
    year: {
        type: String,
        required: [true, 'El año es obligatoria']
    },
    dateVoting: {
        type: String,
        required: [true, 'La fecha de votacion es obligatoria']
    },
    status: {
        type: Boolean,
        default: true
    }

}, { collection: 'participationPeriods' });

module.exports = mongoose.model('Period', periodSchema);