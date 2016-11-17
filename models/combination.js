var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        // unique: true,
        required: true
    },
    children: {
        type: Array
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Combination', schema);
