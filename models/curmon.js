var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    percent: {
        type: String
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Curmon', schema);
