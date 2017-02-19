var winston = require('winston');
var conf = require('../conf');

function getLogger(module) {

    var path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (conf.live) ? 'error':'debug',
                label: path
            }),
            new (winston.transports.File)({
                name: 'error',
                filename: 'logs/log.log',
                level: 'error'
            })
        ]
    });
}

module.exports = getLogger;