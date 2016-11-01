var log = require('../libs/logger')(module);

module.exports = function(req, res, next) {
    log.info('isAuthenticated', req.isAuthenticated());
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
            req.session.returnTo = req.originalUrl || req.url;
        }
        return res.redirect('/auth');
    }
    next();
};