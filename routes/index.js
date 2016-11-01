var conf = require('../conf');
var path = require('path');

module.exports = function (app, express) {
    app.use('/',  require('./common')(express.Router()));
    app.use('/admin', require('../middleware/isAuth'), require('./admin')(express.Router()));
    app.use('/api', require('./api')(express.Router()));
    // app.get('*', function (req, res, next) {
    //     res.sendFile(path.join(conf.rootDir, '/app/index.html'));
    // })
};