const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let profileSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    summary: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }

}, { collection: 'politicalProfiles' });

module.exports = mongoose.model('Profile', profileSchema);