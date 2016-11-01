var crypto = require('crypto');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    country: {type: String},
    email: {
        type: String,
        //unique: true,
        // required: true
    },
    firstname: {
        type: String,
        // required: true
    },
    lastname: {
        type: String,
        // required: true
    },
    phone: {type: String},
    hashedPassword: {
        type: String,
        // required: true
    },
    salt: {
        type: String,
        // required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + "";
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', schema);
