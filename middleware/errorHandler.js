var HttpError = require('../error').HttpError;
var loggger = require('../libs/logger')(module);
var conf = require('../conf');

module.exports = function (app) {
    app.use(function (err, req, res, next) {
        res.status(500).json(err);
        loggger.error(err);
        next();
        // if (typeof err == 'number') err = new HttpError(err);
        // if (err instanceof HttpError) {
        //     log.error(err);
        //     res.status(err.status);
        //     res.sendHttpError(err);
        // } else {
        //     log.error(err);
        //     if (conf.live === false) {
        //         var erorHandler = require('errorhandler')();
        //         erorHandler(err, req, res, next);
        //     } else {
        //         err = new HttpError(500);
        //         res.sendHttpError(err);
        //     }
        // }
    });
};