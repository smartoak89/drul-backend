var error = require('../error').ressError;

exports.create = function (req, res, next) {
    var stocksdAPI = require('../api/stocks');

    isValid(req.body, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);

        stocksdAPI.create(value, function (err, stocks) {
            if (err) return next(err);
            if (!stocks) return res.sendMsg('Ошибка', true, 400);
            res.json(stocks);
        })
    });

};

exports.list = function (req, res, next) {
    var stocksdAPI = require('../api/stocks');

    stocksdAPI.list(function (err, result) {
        if (err) return next(err);
        res.json(result);
    });

};

exports.remove = function (req, res, next) {
    var stocksdAPI = require('../api/stocks');

    stocksdAPI.remove(req.params.id, function(err, result) {
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
        percent: body.percent,
        expires: body.expires
    };

    var schema = v.joi.object().keys({
        name: v.joi.string().required(),
        percent: v.joi.string().required(),
        expires: v.joi.date()
    });

    v.validate(data, schema, callback);
}