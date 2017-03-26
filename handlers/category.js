var categoryAPI = require('../api/category');

exports.create = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.status(400).json({message: err});
        categoryAPI.create(value, function (err, result) {
            if (err) return next(err);
            res.json(result);
        })
    });
};

exports.list = function (req, res, next) {
    categoryAPI.list(function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
};

exports.update = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.status(400).json({message: err});

        categoryAPI.update(req.params.id, value, function (err, result) {
            if (err) return next(err);
            res.json({message: 'Подкатегория добавлени'});
        });
    });

};

exports.add = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.status(400).json({message: err});
        categoryAPI.add(req.params.id, value, function (err) {
            if (err) return next(err);
            res.json({message: 'Категория добавлени'});
        })
    });
};
exports.getFilter = function (req,res,next) {
    var categName = req.params.name;
    var productAPI = require('../api/product');

    productAPI.getProductFilter(categName, function (err, filter) {
        if(err) return next(err);
        res.json(filter);
    });

    // productAPI.findAll({category: categName}, function (err, products) {
    //     if (err) return next(err);
    //     res.json(products);
    // })
};
exports.remove = function (req, res, next) {
    categoryAPI.remove(req.params.id, req.params.index, function(err, result) {
        if (err) return next(err);
        if(!result) return res.json(error(404, 'Категория не найдена'));
        res.json(result);
    })
};

function isValid (req, callback) {
    var v = require('../libs/validator');

    var data = {
        name: req.body.name,
        link: req.body.link,
        article: req.body.article,
        slug: req.body.slug,
        level: req.body.level
    };

    var schema = v.joi.object().keys({
        name: v.joi.string().min(3).max(20).required(),
        link: v.joi.string().min(3).max(20).required(),
        article: v.joi.string().min(3).max(20).required(),
        slug: v.joi.string().min(3).max(20).required(),
        level: v.joi.number()
    });

    v.validate(data, schema, callback);
}