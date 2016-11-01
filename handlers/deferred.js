var error = require('../error').ressError;

exports.add = function (req, res, next) {
    var deferredAPI = require('../api/deferred');
    deferredAPI.add(req, function (err, result) {
        if (err) return next(err);
        if (!result) return res.json({message: 'Product was added'});
        res.json({uuid: result.uuid});
    });

};
exports.getList = function (req, res, next) {
    var userId = req.params.id;
    console.log('userId', userId);
    var deferredAPI = require('../api/deferred');
    deferredAPI.list(userId, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });

};

exports.delete = function (req, res, next) {
    var productId = req.params.id;
    var deferredAPI = require('../api/deferred');
    deferredAPI.delete(productId, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });

};