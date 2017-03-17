var orderAPI = require('../api/order');

var cacheOrder = {
    first: true,
    number: 1
};

exports.add = function (req, res, next) {
    var userId = req.user.uuid;

     isValid(req.body, function (err, data) {
        if (err) return res.status(400).json({message: err});

        if (cacheOrder.first) {

            var criteria = {
                limit: 1,
                sort: {order_num: -1}
            };

            orderAPI.findMaxOrderNum(criteria, function (err, orders) {
                if (err) return res.status(500).json(err);
                console.log('orders', orders);
                if (orders.length > 0){

                    cacheOrder.number = orders[0].order_num + 1;
                }

                return saveOrder(userId, data, res);

            });

        } else {
            cacheOrder.number += 1;
            saveOrder(userId, data, res);
        }
    });

};

exports.buyNow = function (req, res, next) {

     isValid(req.body, function (err, data) {
        if (err) return res.status(400).json({message: err});

        if (cacheOrder.first) {

            var criteria = {
                limit: 1,
                sort: {order_num: -1}
            };

            orderAPI.findMaxOrderNum(criteria, function (err, orders) {
                if (err) return res.status(500).json(err);

                if (orders.length > 0){

                    cacheOrder.number = orders[0].order_num + 1;
                }

                return saveOrderBuyNow(data, res);

            });

        } else {
            cacheOrder.number += 1;
            saveOrderBuyNow(data, res);
        }
    });

};

exports.UserOrders = function (req, res, next) {
    var userId = req.user.uuid;
    var criteria = {owner: userId};

    orderAPI.list(criteria, function (err, orders) {
        if (err) return next(err);
        res.json(orders);
    });
};

exports.allUsersOrders = function (req, res, next) {
    orderAPI.list({}, function (err, orders) {
        if (err) return next(err);
        res.json(orders);
    });
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

function saveOrder (userId, data, res) {
    data.owner = userId;
    data.status = 'Новый заказ';
    data.order_num = cacheOrder.number;

    orderAPI.add(data, function (err, order) {
        if (err) return res.status(500).json({message: err});

        var mailAPI = require('../api/mail');

        cacheOrder.first = false;

        mailAPI.firstOrder(data, function (err, info) {
            if (err) {
                console.log('error send mail', err);
                return next(err);
            }
            console.log('info', info);
        });

        res.json(order);
    });
}

function saveOrderBuyNow (data, res) {
    data.owner = data.phone;
    data.status = 'Новый заказ';
    data.order_num = cacheOrder.number;

    orderAPI.add(data, function (err, order) {
        if (err) return res.status(500).json({message: err});

        // var mailAPI = require('../api/mail');

        cacheOrder.first = false;

        // mailAPI.firstOrder(data, function (err, info) {
        //     if (err) {
        //         console.log('error send mail', err);
        //         return next(err);
        //     }
        //     console.log('info', info);
        // });

        res.json(order);
    });
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
        order_num: v.joi.number(),
        email: v.joi.string().email().allow(''),
        firstname: v.joi.string().min(2).max(50).allow(''),
        lastname: v.joi.string().min(2).max(50).allow(''),
        state: v.joi.string().min(2).max(50).allow(''),
        phone: v.joi.string().min(2).max(50).allow(''),
        status: v.joi.string(),
        currency: v.joi.string(),
        price: v.joi.number(),
        products: v.joi.array().items(v.joi.object().keys({
            combo: v.joi.any(),
            productID: v.joi.string(),
            count: v.joi.number(),
            price: v.joi.number()
        })).required()
    });

    v.validate(data, schema, callback);
}
