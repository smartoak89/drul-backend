var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    parent: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Deferred', schema);
