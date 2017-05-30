var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: {type: String},
    slug: {type: String},
    parent: {type: String},
    parents: {type: Array, default: []},
    children: {type: Array, default: []},
    path: {type: Object, default: {}}

},{
    versionKey: false
});

module.exports = mongoose.model('Category', schema);
