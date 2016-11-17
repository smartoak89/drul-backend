var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    product: {
        type: String
    },
    owner: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Cart', schema);
