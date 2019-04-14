const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidator = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}, no es un rol permitido'
};

let userSchema = new Schema({

    name: {
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
    status: {
        type: Boolean,
        default: true
    }

});

userSchema.plugin(uniqueValidator, { message: '{PATH}, debe ser único' });

module.exports = mongoose.model('User', userSchema);