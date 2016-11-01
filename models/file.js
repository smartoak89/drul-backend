var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: { type: String },
    size: { type: Number },
    mime: { type: String },
    parent: { type: String },
    created: { type: Date }
},{
    versionKey: false
});

module.exports = mongoose.model('File', schema);
