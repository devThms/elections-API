const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let candidateSchema = new Schema({

    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    lastName: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    address: {
        type: String,
        required: [true, 'El numero de telefono es bligatorio']
    },
    phone: {
        type: String,
        required: [true, 'Es requerido indicar su fundacion']
    },
    img: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    political: {
        type: Schema.Types.ObjectId,
        ref: 'Political',
        required: [true, 'El Partido politico es obligatorio']
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: [true, 'El Perfil politico es obligatorio']
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        required: [true, 'El Periodo de Participacion es obligatorio']
    }

}, { collection: 'candidates' });

module.exports = mongoose.model('Candidate', candidateSchema);