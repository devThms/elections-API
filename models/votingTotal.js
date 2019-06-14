const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let totalVotesSchema = new Schema({

    validVotes: {
        type: Number,
        required: [true, 'El total de votos validos es obligatorio']
    },
    nullVotes: {
        type: Number,
        required: [true, 'El total de votos nulos es obligatorio']
    },
    blankVotes: {
        type: Number,
        required: [true, 'El total de votos en blanco es obligatorio']
    },
    objectionVotes: {
        type: Number,
        required: [true, 'El total de votos impugnados es obligatorio']
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
    center: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
        required: [true, 'El centro de votación es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    }

}, { collection: 'votingTotal' });

module.exports = mongoose.model('totalVotes', totalVotesSchema);