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
    email: {type: String},
    firstname: {type: String},
    lastname: {type: String},
    phone: {type: String},
    permission: {type: String, default: 'member'},
    ballance: {type: Object, default: {amount: 0, currency: 'UAH'}},
    hashedPassword: {type: String},
    salt: {type: String},
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
