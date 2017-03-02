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
    category: {type: Object},
    show: {type: Boolean},
    price: {type: Number},
    combo: {type: Array},
    sublines: {type: Array},
    slug: {type: String},
    stock: {type: Object},
    reviews_count: {type: Number},
    created: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Product', schema);
