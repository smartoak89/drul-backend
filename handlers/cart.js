var cartAPI = require('../api/cart');
var error = require('../error').ressError;

exports.add = function (req, res, next) {
    var user = req.params.user;
    var product = req.params.product;
    cartAPI.find({owner: user, product: product}, function (err, result) {
        if (err) return next(err);
        if (result) return res.status(400).json(error(400, 'Товар в корзине уже существует!'));

        cartAPI.add(user, product, function (err, result) {
            if (err) return next(err);
            if (!result) res.status(500).json(error(500, 'Ошибка добавления в корзину!'));
            res.json({uuid: result.uuid});
        })
    });
};

exports.list = function (req, res, next) {
    //TODO: first need find user and then find list for him
    cartAPI.list({owner: req.params.user}, function (err, products) {
        if (err) return next(err);
        res.json(products);
    })
};

exports.delete = function (req, res, next) {
    var user = req.params.user;
    var product = req.params.product;
    var criteria = {
        owner: user,
        product: product
    };
    cartAPI.delete(criteria, function (err, result) {
        if (err) return next(err);
        if (!result) return res.json(error(404, 'В корзине нет такого товара!'));
        res.json(result);
    });
};