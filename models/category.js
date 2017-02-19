var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    link: {
        type: String
    },
    children: {
        type: Array
    },
    article: {type: String},
    slug: {type: String},
    level: {type: Number},
    parent: {type: String}
},{
    versionKey: false
});

module.exports = mongoose.model('Category', schema);
