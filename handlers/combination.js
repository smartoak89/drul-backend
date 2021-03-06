var log = require('../libs/logger')(module);
var error = require('../error/index').ressError;
var combinationAPI = require('../api/combination');
var trans = require('../libs/support').transliterator;

exports.create = function (req, res, next) {
    isValid(req.body, function (err, validBody) {
        if (err) return res.status(400).json(error(400, err));
        combinationAPI.create(validBody, function (err, product) {
            if (err) return next(err);
            res.json(product);
        })
    });
};
exports.list = function (req, res, next) {
    var criteria = req.query || {};
    combinationAPI.list(criteria, function (err, combinations) {
        if (err) return next(err);
        res.json(combinations);
    })
};
exports.update = function (req, res, next) {
    var id = req.params.id;

    isValid(req.body, function(err, value) {
        if (err) return res.status(400).json(error(400, err));

        combinationAPI.update({uuid: id}, value, function (err, result) {
            if (err) return next(err);
            if (!result) return res.status(400).json(error(400, 'Нет такой комбинации!'));
            res.json(result);
        })
    });

};

exports.updateValue = function (req, res, next) {
    var id = req.params.id;
    var ind = req.params.index;
    if (!req.body.name) return  res.status(400).json({message: 'Укажите значечие'});

    combinationAPI.updateValue(id, ind, req.body.name, function (err, result) {
        if (err) return next(err);
        if (!result) return res.status(400).json(error(400, 'Нет такой комбинации!'));
        res.json(result);
    })

};

exports.delete = function (req, res, next) {

    combinationAPI.delete(req.params.id, function (err, result) {
        if (err) return next(err);
        if (!result) return res.status(404).json(error(404, 'Нет такой комбинации!'));
        res.json(result);
    })

};

function isValid (body, callback) {
    var v = require('../libs/validator');

    var data = {
        name: body.name,
        slug: trans(body.name).replace(/\s/ig, '-'),
        value: body.value,
        checked: body.checked
    };

    var schema = v.joi.object().keys({
        name: v.joi.string().max(50).required(),
        slug: v.joi.string(),
        value: v.joi.array().items(v.joi.string()),
        checked: v.joi.boolean()
    });

    v.validate(data, schema, callback);
}