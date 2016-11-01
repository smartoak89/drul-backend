module.exports = function (req, res, next) {
    res.sendHttpError = function (error) {
        res.status(error.status);
        console.log(error);
        res.render('common/error-page', {error: {status: error.status, message: error.message}});
    };
    next();
};