module.exports = function (req, res, next) {
    res.render('common/error-page', {error: 'Page Not Found'});
    next();
};