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
    subcat: {
        type: Array
    },
    article: {type: String}
},{
    versionKey: false
});

module.exports = mongoose.model('Category', schema);
