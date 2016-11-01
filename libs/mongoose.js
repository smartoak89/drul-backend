var conf = require('../conf');
var mongoose = require('mongoose');

mongoose.connect(conf.mongoose.uri);

module.exports = mongoose;
