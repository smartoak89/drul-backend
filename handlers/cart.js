var HttpError = require('../error/index').HttpError;
var cartAPI = require('../api/cart');
var error = require('../error').ressError;

exports.add = function (req, res, next) {
    cartAPI.add(req.params.id, req.body.user, function (err, result) {
        if (err) return next(err);
        if (!result) res.status(400).json(error(400, 'can\'t add to cart'))
        res.json(result);
    })
};
exports.list = function (req, res, next) {
    //TODO: first need find user and then find list for him
    cartAPI.list({owner: req.params.id}, function (err, result) {
        if (err) return next(err);
        res.json(result);
    })
};