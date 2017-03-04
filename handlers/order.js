var orderAPI = require('../api/order');
var userAPI = require('../api/user');
var productAPI = require('../api/product');
var promise = require('bluebird');

exports.add = function (req, res, next) {
    var userId = req.user.uuid;

    userAPI.find(userId, function (err, user) {
        if (err) return next(err);
        if (!user) res.status(404).json({message: 'Пользователь не найден!'});

        // productAPI.findOne({uuid: productId}, function (err, product) {
        //     if (err) return next(err);
        //     if (!product) res.status(404).json({message: 'Неверный id товара!'});

            isValid(req.body, function (err, data) {
                if (err) return res.status(400).json({message: err});
                data.owner = userId;
                data.owner_name = user.firstname + ' ' + user.lastname;
                data.status = 'Новый заказ';
                data.order_num = new Date().getFullYear() + "" + getUniqOrderId();

                orderAPI.add(data, function (err, order) {
                    if (err) return res.status(400).json({message: err});
                    res.json(order);
                });
            });
        // })
    });
};

exports.allUserOrders = function (req, res, next) {
    var userId = req.params.userId;

    userAPI.find(userId, function (err, user) {
        if (err) return next(err);
        if (!user) res.status(404).json({message: 'Неверный id пользователя!'});

        orderAPI.list({owner: userId}, function (err, orders) {
            if (err) return next(err);
            res.json(orders);
        })
    });
};

exports.allListOrders = function (req, res, next) {
    orderAPI.list({}, function (err, orders) {
        if (err) return next(err);
        res.json(orders);
    })
};

exports.update = function (req, res, next) {
    var orderId = req.params.orderId;

    orderAPI.find({uuid: orderId}, function (err, order) {
        if (err) return next(err);
        if (!order) return res.status(404).json({message: 'Заказ не найден!'});

        isValid(req.body, function (err, data) {
            if (err) return res.status(400).json({message: err});

            for (var k in data) {
                order[k] = data[k];
            }

            order.updated = Date.now();

            orderAPI.update(orderId, order, function (err, result) {
                if (err) return next(err);
                res.json(order);
            })
        });
    })

};

exports.getOneOrder = function (req, res, next) {
    var orderId = req.params.orderId;

    orderAPI.find({uuid: orderId}, function (err, order) {
        if (err) return next(err);
        if (!order) return res.status(404).json({message: 'Заказ не найден!'});

        res.json(order);
        // productAPI.findOne({uuid: order.product_id}, function (err, product) {
        //     if (err) return next(err);
        //     if (!product) return res.status(404).json({message: 'Товар не найден!'})
        //     product.combo = order.combo;
        //
        //     res.json(product);
        // })
    })

};

exports.remove = function (req, res, next) {
    var orderId = req.params.orderId;

    orderAPI.find({uuid: orderId}, function (err, order) {
        if (err) return next(err);
        if (!order) return res.status(404).json({message: 'Заказ не найден!'});

        orderAPI.delete(orderId, function (err, result) {
            if (err) return next(err);
            res.json(result);
        })
    })

};

exports.removeProductFromOrder = function (req, res, next) {
    var orderId = req.params.orderId;
    var productIndex = req.params.productIndex;

    orderAPI.find({uuid: orderId}, function (err, order) {
        if (err) return next(err);
        if (!order) return res.status(404).json({message: 'Заказ не найден!'});
        order.products.splice(productIndex, 1);

        orderAPI.update(orderId, order, function (err, result) {
            if (err) return next(err);
            res.json(result);
        })
    })

};

function getUniqOrderId () {
    var k = Math.floor(Math.random()* 1000000);
    return k;
}

function isValid (body, callback) {
    var v = require('../libs/validator');

    var data = {
        order_num: body.order_num,
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        state: body.state,
        phone: body.phone,
        status: body.status,
        currency: body.currency,
        price: body.price,
        products: body.products.map(function (product) {
            return {
                combo: product.combo,
                productID: product.productID,
                count: product.count,
                price: product.price
            }
        })
    };

    var schema = v.joi.object().keys({
        order_num: v.joi.string(),
        email: v.joi.string().email(),
        firstname: v.joi.string().required().min(2).max(50),
        lastname: v.joi.string().required().min(2).max(50),
        state: v.joi.string().required().min(2).max(50),
        phone: v.joi.string().required().min(2).max(50),
        status: v.joi.string(),
        currency: v.joi.string(),
        price: v.joi.number().required(),
        products: v.joi.array().items(v.joi.object().keys({
            combo: v.joi.any(),
            productID: v.joi.string(),
            count: v.joi.number(),
            price: v.joi.number()
        })).required()
    });

    v.validate(data, schema, callback);
}