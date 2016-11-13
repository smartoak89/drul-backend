var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    productID: {
        type: String
    },
    owner: {
        type: String
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Cart', schema);
