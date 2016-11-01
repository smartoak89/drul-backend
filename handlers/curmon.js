var error = require('../error').ressError;

exports.createEdit = function (req, res, next) {
    var percent = req.body.percent;
    console.log('Post curmon => ', percent);
    if (!percent) res.status(400).json(error(400, "Missing percent"));

    var curmonAPI = require('../api/curmon');
    curmonAPI.createEdit(percent, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
};

exports.get = function (req, res, next) {
    var curmonAPI = require('../api/curmon');
    curmonAPI.get(function (err, result) {
        if (err) return next(err);
        if (!result) return res.status(200).json({percent: 0});
        res.json({percent: result.percent});
    });
};