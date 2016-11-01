module.exports = function (req, res, next) {
    res.sendMsg = function (message, type, status) {
        status = status || 200;
        type = type ? 'error' : 'success';
        res.status(status);
        res.json({
            type: type,
            message: message
        });
    };
    next();
};