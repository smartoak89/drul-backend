var deliveryAPI = require('../api/delivery');

exports.addNew = function (req, res, next) {
    validation(req.body, function (err, value) {

        if (err) return res.status(400).json({message: err});

        deliveryAPI.add(value, res, next, function (result) {
            res.json(result);
        })
    });
};

exports.list = function (req, res, next) {
    deliveryAPI.list(res, next, function (result) {
        res.json(result);
    })
};

exports.remove = function (req, res, next) {
    deliveryAPI.find(req.params.id, res, next, function (result) {
        result.remove();
        res.json(200);
    })
};

exports.edit = function (req, res, next) {
    validation(req.body, function (err, value) {
        if (err) return res.status(400).json({message: err});

        deliveryAPI.edit(req.params.id, value, res, next, function (result) {
            res.json(result);
        })

    });

};

function validation (body, callback) {
    var v = require('../libs/validator');

    var data = {
        name: body.name,
        country: body.country,
        price: {
            amount: body.price.amount,
            currency: body.price.currency
        },
        free: body.free
    };

    var schema = v.joi.object().keys({
        name: v.joi.string(),
        country: v.joi.string(),
        price: v.joi.object().keys({
            amount: v.joi.number().positive(),
            currency: v.joi.string().max(3)
        }),
        free: v.joi.number().positive()
    });

    v.validate(data, schema, callback);
}