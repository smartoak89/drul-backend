var Promise = require('bluebird');
var HttpError = require('../error').HttpError;
var conf = require('../conf');
var log = require('../libs/logger')(module);
var path = require('path');

exports.app = {
    get: function (req, res, next) {
        res.sendFile(path.join(conf.rootDir, '/app/index.html'));
    }
};
