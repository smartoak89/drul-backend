var conf = require('../conf');
var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

mongoose.connect(conf.mongoose.uri);

module.exports = mongoose;
