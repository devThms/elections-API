const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let controlSchema = new Schema({

    time: {
        type: Date,
        required: [true, 'El tiempo es obligatorio']
    },
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es requerido']
    },
    candidate: {
        type: Schema.Types.ObjectId,
        ref: 'Candidate',
        required: [true, 'El Candidato es obligatorio']
    },
    table: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: [true, 'La de mesa de votacion es obligatoria']
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: [true, 'El perfil politico es obligatorio']
    },
    political: {
        type: Schema.Types.ObjectId,
        ref: 'Political',
        required: [true, 'El partido politico es obligatorio']
    },
    amount: {
        type: Number,
        required: [true, 'La cantidad es obligatoria']
    },
    is_closed: {
        type: Boolean,
        default: false
    }

}, { collection: 'votingControls' });

module.exports = mongoose.model('Control', controlSchema);