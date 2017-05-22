var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: {type: String},
    country: {type: String, default: 'Украина'},
    price: {type: Object, default: {
        amount: 0,
        currency: 'UAH'
    }},
    free: {type: Number},
    created: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Delivery', schema);
