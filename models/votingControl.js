const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let controlSchema = new Schema({

    time: {
        type: String,
        required: [true, 'El tiempo es obligatorio']
    },
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
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
    center: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
        required: [true, 'El centro de votación es obligatorio']
    },
    amount: {
        type: Number,
        required: [true, 'La cantidad es obligatoria']
    },
    status: {
        type: Boolean,
        default: true
    }

}, { collection: 'votingControls' });

module.exports = mongoose.model('Control', controlSchema);