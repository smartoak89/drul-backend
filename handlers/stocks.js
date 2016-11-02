var error = require('../error').ressError;

exports.create = function (req, res, next) {
    var stocksdAPI = require('../api/stocks');

    isValid(req.body, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);

        stocksdAPI.create(value, function (err, stocks) {
            if (err) return next(err);
            if (!stocks) return res.sendMsg('Ошибка', true, 400);
            res.json({uuid: stocks.uuid});
        })
    });

};

function isValid (body, callback) {
    var v = require('../libs/validator');

    var data = {
        name: body.name,
        percent: body.percent
    };

    var schema = v.joi.object().keys({
        name: v.joi.string().required(),
        percent: v.joi.string().required()
    });

    v.validate(data, schema, callback);
}