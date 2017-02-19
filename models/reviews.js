var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    owner_id: {
        type: String
    },
    owner_name: {
        type: String
    },
    product_id: {
        type: String
    },
    body: {
        type: String
    },
    publish: {
        type: Boolean
    },
    created: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Reviews', schema);
