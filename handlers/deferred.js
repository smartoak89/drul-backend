var error = require('../error').ressError;
var deferredAPI = require('../api/deferred');

exports.add = function (req, res, next) {
    var user = req.user.uuid;
    var product = req.params.product;
    deferredAPI.find({owner: user, product: product}, function (err, result) {
        if (err) return next(err);
        if (result) return res.status(400).json({message: 'Товар в избранных уже существует!'});

        deferredAPI.add(user, product, function (err, result) {
            if (err) return next(err);
            if (!result) res.status(500).json({message: 'Ошибка добавления в избранные!'});
            res.json(result);
        })
    });
};
exports.list = function (req, res, next) {
    deferredAPI.list({owner: req.user.uuid}, function (err, products) {
        if (err) return next(err);
        res.json(products);
    })
};
exports.delete = function (req, res, next) {
    var user = req.user.uuid;
    var product = req.params.product;
    var criteria = {
        owner: user,
        product: product
    };
    deferredAPI.delete(criteria, function (err, result) {
        if (err) return next(err);
        if (!result) return res.json(error(404, 'В избранных нет такого товара!'));
        res.json(result);
    });
};