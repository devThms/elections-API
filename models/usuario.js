const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidator = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}, no es un rol permitido'
};

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidator
    },
    estado: {
        type: Boolean,
        default: true
    }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH}, debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);