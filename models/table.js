const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let tableSchema = new Schema({

    localNumber: {
        type: Number,
        required: [true, 'El numero de mesa local es obligatorio']
    },
    nationalNumber: {
        type: Number,
        required: [true, 'El numero de mesa nacional es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    },
    center: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
        required: [true, 'El Centro de votación es obligatorio']
    },
    is_closed: {
        type: Boolean,
        default: false
    }

}, { collection: 'tables' });

module.exports = mongoose.model('Table', tableSchema);