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
    category: {type: Object},
    price: {type: Number},
    image: {type: String},
    combo: {type: Array},
    slug: {type: String},
    stock: {type: Object},
    owner: {
        type: String
    },
    product_uuid: {type: String},
    created: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Cart', schema);
