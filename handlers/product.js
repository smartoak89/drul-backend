var msg = require('../message/ru/product');
var log = require('../libs/logger')(module);
var error = require('../error/index').ressError;
var productApi = require('../api/product');

exports.create = function (req, res, next) {

    isValid(req, function (err, value) {
        log.log('gotVal %', value);
        if (err) return res.sendMsg(err, true, 400);
        productApi.create(value, function (err, product) {
            if (err) return next(err);
            res.json(product);
        })
    });
};

exports.list = function (req, res, next) {
    var urlencode = require('urlencode');
    // console.log('query', req.query);
    var query = Object.keys(req.query);
    console.log('color', req.query)

    var productApi = require('../api/product');
    var criteria = {};
    productApi.findAll(criteria, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
};

exports.get = function (req, res, next) {
    productApi.findOne({uuid: req.params.id}, function (err, product) {
        if (err) return next(err);
        if (!product) return res.status(404).json(error(404, 'Товар не найден'));
        res.json(product);
    });
};
exports.getProductFilter = function (req, res, next) {

    productApi.getProductFilter(req.params.category, function (err, filter) {
        if (err) return next(err);
        res.json(filter);
    });
};

exports.update = function (req, res, next) {
    isValid(req, function (err, value) {
        console.log('Preupdate product', err);
        if (err) return res.sendMsg(err, true, 400);
        productApi.update(req.params.id, value, function (err, product) {
            // console.log('update product', product);
            if (err) return next(err);
            res.json(product);
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
        price: req.body.price,
        slug: req.body.slug,
        stock: req.body.stock,
        combo: req.body.combo,
        sublines: req.body.sublines,
        show: req.body.show
    };

    var schema = v.joi.object().keys({
        name: v.joi.string().min(4).max(50).required(),
        article: v.joi.string().max(50),
        description: v.joi.string(),
        category: v.joi.object(),
        slug: v.joi.string().max(50),
        stock: v.joi.string().allow(''),
        price: v.joi.number(),
        combo: v.joi.array(),
        sublines: v.joi.array().items(v.joi.object()),
        show: v.joi.boolean()
    });

    v.validate(data, schema, callback);
}

//TODO: product should be with unique article and name