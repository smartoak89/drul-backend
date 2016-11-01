var msg = require('../message/ru/product');
var log = require('../libs/logger')(module);
var HttpError = require('../error/index').HttpError;

exports.create = function (req, res, next) {
    var productApi = require('../api/product')(req.user);

    isValid(req, function (err, value) {
        log.log('gotVal %', value);
        if (err) return res.sendMsg(err, true, 400);
        productApi.create(value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.CREATED);
        })
    });
};

exports.list = function (req, res, next) {
    var productApi = require('../api/product');

    productApi.list(function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
};

exports.get = function (req, res, next) {
    var productApi = require('../api/product')(req.user);
    productApi.findOne({uuid: req.params.id}, function (err, data) {
        if (err) return next(err);
        res.json({data: data});
    });
};

exports.update = function (req, res, next) {
    var productApi = require('../api/product')(req.user);
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        productApi.update(req.params.id, value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.UPDATED);
        });
    });
};

exports.gallery = function (req, res, next) {
    var fileAPI = require('../api/file');
    var document = {parent: req.params.id};
    fileAPI.findAll(document, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
};

exports.remove = function (req, res, next) {
    var productApi = require('../api/product')(req.user);
    productApi.remove(req.params.id, function(err) {
        if (err) return next(err);
        res.sendMsg(msg.DELETED);
    })
};

function viewData (data) {
    var res = {
        uuid: data.uuid,
        name: data.name,
        article: data.article,
        description: data.description,
        category: data.category,
        count: data.count,
        color: data.color,
        size: data.size,
        price: data.price,
        gallery: data.gallery,
        old_price: data.old_price
    };
    return res;
}

function isValid (req, callback) {
    var v = require('../libs/validator');

    var data = {
        name: req.body.name,
        article: req.body.article,
        description: req.body.description,
        category: req.body.category,
        count: req.body.count,
        color: req.body.color,
        size: req.body.size,
        price: req.body.price,
        photo: req.body.photo,
        old_price: req.body.old_price,

    };

    var schema = v.joi.object().keys({
        name: v.joi.string().min(4).max(50).required(),
        article: v.joi.string().token().max(50),
        description: v.joi.string().max(250),
        category: v.joi.string().max(50),
        photo: v.joi.string().max(50),
        count: v.joi.string().max(3),
        color: v.joi.array().items(v.joi.string()),
        size: v.joi.array().items(v.joi.string()),
        price: v.joi.number(),
        old_price: v.joi.number(),
    });

    v.validate(data, schema, callback);
}

//TODO: product should be with unique article and name