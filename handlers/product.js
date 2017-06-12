var log = require('../libs/logger')(module);
var error = require('../error/index').ressError;
var productApi = require('../api/product');

exports.create = function (req, res, next) {

    isValid(req, function (err, value) {
        if (err) return res.status(400).json(err);

        productApi.findAll({article: value.article, sort: 'count.desk', limit: 1}, function (err, products) {
            var count =  0;
            if (products[0] && products[0].count) count = products[0].count;
            value.count = count + 1;
            value.article = value.article + '-' + value.count;

            productApi.create(value, function (err, product) {
                if (err) return next(err);
                res.json(product);
            })

        })

    });
};

exports.list = function (req, res, next) {
    productApi.findAll(req.query, function (err, data) {
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

exports.listFromCurrentCateg = function (req, res, next){
    var categoryName = req.params.name;
    var criteria = req.query;
    criteria.category = categoryName;
    productApi.findAll(criteria, function (err, products) {
        if (err) return next(err);
        res.json(products);
    })

};

exports.getProductFilter = function (req, res, next) {
    productApi.getProductFilter(req.params.category, function (err, filter) {
        if (err) return next(err);
        res.json(filter);
    });
};

exports.update = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.status(400).json(err);
        productApi.update(req.params.id, value, function (err, product) {

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
        res.json('Товар удален');
    })
};

function isValid (req, callback) {
    var v = require('../libs/validator');
    console.log('valid prod', req.body);
    var data = {
        name: req.body.name,
        article: req.body.article,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        slug: req.body.slug,
        stock: req.body.stock || '',
        combo: req.body.combo,
        sublines: req.body.sublines,
        show: req.body.show,
        groups: req.body.groups
    };

    var schema = v.joi.object().keys({
        name: v.joi.string(),
        article: v.joi.string().max(50),
        description: v.joi.string(),
        category: v.joi.object(),
        slug: v.joi.string().max(50),
        stock: v.joi.object().keys({
            stock_id: v.joi.string(),
            old_price: v.joi.number(),
            percent: v.joi.number()
        }).allow(''),
        price: v.joi.number(),
        combo: v.joi.array(),
        sublines: v.joi.array().items(v.joi.object()),
        show: v.joi.boolean(),
        groups: v.joi.array()
    });

    v.validate(data, schema, callback);
}

//TODO: product should be with unique article and name