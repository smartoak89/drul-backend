var log = require('../libs/logger')(module);
var vendorAPI = require('../api/vendor');

exports.list = function (req, res, next) {
    vendorAPI.get({name: 'vendor-list'}, function (err, vendorList) {
        if (err) return next(err);
        res.json(vendorList);
    })
};
exports.update = function (req, res, next) {
    var id = req.params.id;

    isValid(req.body, function(err, value) {
        if (err) return res.status(400).json(error(400, err));
        vendorAPI.get({name: 'vendor-list'}, function (err, vendorList) {
            if (err) return next(err);
            if (!vendorList) {
                vendorAPI.create(function (err) {
                    if (err) return next(err);

                    vendorAPI.update({name: 'vendor-list'}, value, function (err, result) {
                        if (err) return next(err);
                        res.json(result);
                    })
                })
            } else {
                vendorAPI.update({name: 'vendor-list'}, value, function (err, result) {
                    if (err) return next(err);
                    res.json(result);
                })
            }
        });

    });

};

function isValid (body, callback) {
    var v = require('../libs/validator');

    var data = {
        value: body.value
    };

    var schema = v.joi.object().keys({
        value: v.joi.array().items(v.joi.string())
    });

    v.validate(data, schema, callback);
}