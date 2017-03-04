var cartAPI = require('../api/cart');
var productAPI = require('../api/product');
var error = require('../error').ressError;

exports.add = function (req, res, next) {
    var combo = req.body.combo;
    var imageId = req.body.image;
    var user = req.user.uuid;
    var productId = req.params.product;
    productAPI.findOne({uuid: productId}, function (err, product) {
        if (err) return callback(err);
        if (!product) return res.status(404).json({message: 'Product Not Found'});

        cartAPI.find({owner: user, product_uuid: productId}, function (err, result) {
            if (err) return next(err);
            var data = {
                name: product.name,
                price: product.price,
                category: product.category,
                combo: combo,
                image: imageId,
                product_uuid: productId,
                article: product.article,
                owner: user,
                stock: product.stock
            };

            cartAPI.add(user, data, function (err, savedProductInCart) {
                if (err) return next(err);
                if (!savedProductInCart) return res.status(500).json(error(500, 'Ошибка добавления в корзину!'));
                res.json(savedProductInCart);
            })
        });

    });
};

exports.list = function (req, res, next) {
    //TODO: first need find user and then find list for him
    cartAPI.list({owner: req.user.uuid}, function (err, products) {
        if (err) return next(err);
        res.json(products);
    })
};

exports.delete = function (req, res, next) {
    console.log('user', req.user);

    var user = req.user.uuid;
    var product = req.params.product;
    var criteria = {
        owner: user,
        uuid: product
    };
    cartAPI.delete(criteria, function (err, result) {
        if (err) return next(err);
        if (!result) return res.json(error(404, 'В корзине нет такого товара!'));
        res.json(result);
    });
};