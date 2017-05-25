var error = require('../error').ressError;
var stocksAPI = require('../api/stocks');

exports.create = function (req, res, next) {
    isValid(req.body, function (err, value) {
        if (err) return res.status(400).json({message: err});

        stocksAPI.create(value, function (err, stocks) {
            if (err) return next(err);
            res.json(stocks);
        })
    });

};

exports.list = function (req, res, next) {
    stocksAPI.list(function (err, result) {
        if (err) return next(err);
        res.json(result);
    });

};

exports.remove = function (req, res, next) {
    stocksAPI.remove(req.params.id, function(err, result) {
        if (err) return next(err);
        if(!result) {
            return res.status(404).json(error(404, 'Акция не найдена'));
        }
        res.json(result);
    })
};

function isValid (body, callback) {
    var v = require('../libs/validator');

    var data = {
        name: body.name,
        percent: body.percent
    };

    var schema = v.joi.object().keys({
        name: v.joi.string().required(),
        percent: v.joi.number().required()
    });

    v.validate(data, schema, callback);
}