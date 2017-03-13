var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    owner: {
        type: Object,
        required: true
    },
    owner_name: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    order_num: {
        type: Number
    },
    price: {type: Number},
    currency: {
        type: String
    },
    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Order', schema);
