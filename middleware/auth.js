var auth = require('../libs/passport').authenticate('local', {
    failureRedirect: '/auth',
    failureFlash: true });

module.exports = auth;