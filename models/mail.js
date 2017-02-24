var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    text: {type: String},
    name: {type: String},
    created: { type: Date }
},{
    versionKey: false
});

module.exports = mongoose.model('Mail', schema);
