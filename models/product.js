var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    article: {type: String},
    name: {type: String},
    description: {type: String},
    category: {type: String},
    count: { type: String },
    color: { type: Array },
    size: { type: Array },
    price: {type: Number},
    old_price: {type: Number},
    photo: {type: String},
    gallery: {type: Array},
    diferredId: {type: String},
    created: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Product', schema);
