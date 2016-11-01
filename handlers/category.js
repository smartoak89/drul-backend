var HttpError = require('../error/index').HttpError;
var msg = require('../message/ru/category');
var categoryAPI = require('../api/category');

exports.create = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        categoryAPI.create(value, function (err, result) {
            if (err) return next(err);
            res.json({uuid: result.uuid});
            // res.sendMsg(msg.CATEGORY_ADDED);
        })
    });
};

exports.list = function (req, res, next) {
    categoryAPI.list(function (err, result) {
        if (err) return next(err);
        var list = result.map(function (i) {
            return {
                uuid: i.uuid,
                name: i.name,
                link: i.link,
                subcat: i.subcat
            }
        });
        res.json(list);
    });
};

exports.update = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        categoryAPI.update(req.params.id, value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.CATEGORY_UPDATED);
        });
    });

};

exports.add = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        categoryAPI.add(req.params.id, value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.SUBCATEGORY_UPDATED);
        })
    });
};

exports.remove = function (req, res, next) {
    categoryAPI.remove(req.params.id, req.params.index, function(err, result) {
        if (err) return next(err);
        if(!result) return next(new HttpError(404));
        res.sendMsg(msg.CATEGORY_DELETED);
    })
};

function isValid (req, callback) {
    var v = require('../libs/validator');

    var data = {
        name: req.body.name,
        link: req.body.link,
        article: req.body.article
    };

    var schema = v.joi.object().keys({
        name: v.joi.string().min(3).max(20).required(),
        link: v.joi.string().alphanum().min(3).max(20).required(),
        article: v.joi.string().alphanum().min(3).max(20).required()

    });

    v.validate(data, schema, callback);
}