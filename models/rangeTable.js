const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let rangeSchema = new Schema({

    initial: {
        type: Number,
        required: [true, 'El numero inicial es obligatorio']
    },
    final: {
        type: Number,
        required: [true, 'El numero final es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    },
    center: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
        required: [true, 'El Centro de votación es obligatorio']
    }

}, { collection: 'rangeTables' });

module.exports = mongoose.model('Range', rangeSchema);