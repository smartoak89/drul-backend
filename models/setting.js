var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    monitoring: {type: Number, default: 0}
},{
    versionKey: false
});

module.exports = mongoose.model('Setting', schema);
