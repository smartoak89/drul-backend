module.exports = function (app) {
    app.use(function configureUser (req, res, next) {
        if (req.session.passport) {
            var userAPI = require('../api/user');
            userAPI.findOne({uuid: req.session.passport.user}, function(err, user) {
                if (err) return next(err);
                if (!user) return next();
                req.user = user;
            })
        } else {
            req.user = {
                permission: 'member',
                currency: req.session.currency || 'UAH'
            };
        }
        app.locals = {
            user: {
                currency: req.user.currency
            }
        };
        next();
    });
}