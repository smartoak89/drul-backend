var Promise = require('bluebird');
var orderAPI = require('../api/order');
var productAPI = require('../api/product');
var memstorAPI = require('../api/memstor');
var currencyAPI = require('../api/currency');

var totalAmount = 0;

exports.add = function (req, res, next) {
    var userId = req.user.uuid;

    isValid(req.body, function (err, data) {
        if (err) return res.status(400).json({message: err});

        Promise.map(data.products, recount(data.currency, next)).then(function () {

            lastOrder(next, function (num) {
                data.owner = userId;
                data.status = 'Новый заказ';
                data.order_num = num;
                data.price = totalAmount;
                totalAmount = 0;
                // data.products = orderProducts;

                saveOrder(data, res, next);
            })
        })
    });

};

exports.buyNow = function (req, res, next) {
    var header = req.headers['authorization'];

    isValid(req.body, function (err, data) {
        if (err) return res.status(400).json({message: err});

        if (header) {
            var token = 'token-' + header;

            memstorAPI.get(token, next, function (userCli) {
                var user = JSON.parse(userCli);

                Promise.map(data.products, recount(data.currency, next)).then(function () {

                    lastOrder(next, function (num) {
                        data.owner = user.uuid;
                        data.firstname = user.firstname;
                        data.lastname = user.lastname;
                        data.state = user.country;
                        data.email = user.email;
                        data.phone = data.phone;
                        data.status = 'Новый заказ';
                        data.order_num = num;
                        data.price = totalAmount;

                        totalAmount = 0;
                        saveOrderBuyNow(data, res, next);
                    })

                });
            });
        } else {
            Promise.map(data.products, recount(data.currency, next)).then(function () {

                lastOrder(next, function (num) {
                    data.owner = data.phone;
                    data.status = 'Новый заказ';
                    data.order_num = num;
                    data.price = totalAmount;
                    totalAmount = 0;
                    saveOrderBuyNow(data, res, next);
                })
            });
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

            Promise.map(data.products, recount(data.currency, next)).then(function () {
                data.price = totalAmount;
                data.updated = Date.now();
                totalAmount = 0;

                for (var k in data) {
                    order[k] = data[k];
                }

                orderAPI.update(orderId, order, function (err, result) {
                    if (err) return next(err);
                    res.json(order);
                })
            });
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
        var splice = order.products.splice(productIndex, 1)[0];
        order.price = order.price - (splice.price * splice.count);

        console.log('order', order);
        console.log('splice', splice);

        orderAPI.update(orderId, order, function (err, result) {
            if (err) return next(err);
            res.json(result);
        })
    })

};

function recount(currency, next) {
    return Promise.promisify(function (item, ind, count, callback) {

        productAPI.findOne({uuid: item.productID}, function (err, product) {
            if (err) return callback(err);
            if (!product) callback();

            if (currency.toUpperCase() != 'UAH') {
                currencyAPI.converter(currency, product, next, function (recountProduct) {
                    product = recountProduct;
                    correctAmount();
                })
            } else {
                correctAmount();
            }

            function correctAmount () {
                totalAmount += product.price * item.count;
                item.price = product.price;
                console.log('item', item);
                callback(null, item);
            }
        });
    });
}
function lastOrder(next, callback) {

    memstorAPI.get('last_order', next, function (num) {
        if (num) return callback(Number(num) + 1);

        var criteria = {
            limit: 1,
            sort: {order_num: -1}
        };

        orderAPI.list(criteria, function (err, orders) {
            if (err) return next(err);
            var nextOrderNumber;

            if (orders[0]) {
                nextOrderNumber = orders[0].order_num + 1;
            } else {
                nextOrderNumber = 1;
            }

            callback(nextOrderNumber);

        });
    })
}
function saveOrder(data, res, next) {
    save(data, next, function (order) {
        res.json(order);
    });
}
function saveOrderBuyNow(data, res, next) {
    save(data, next, function (order) {
        data.updated = Date.now();
        res.json(order);
    })

}
function save(data, next, callback) {
    orderAPI.add(data, function (err, order) {
        if (err) return next(err);
        memstorAPI.set('last_order', data.order_num);
        callback(order);
    });
}
function isValid(body, callback) {
    var v = require('../libs/validator');

    var data = {
        order_num: body.order_num,
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        state: body.state,
        phone: body.phone,
        status: body.status,
        currency: body.currency.toUpperCase(),
        products: body.products.map(function (product) {
            return {
                combo: product.combo,
                productID: product.productID,
                count: product.count || 1
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
        currency: v.joi.string().uppercase(),
        products: v.joi.array().items(v.joi.object().keys({
            combo: v.joi.any(),
            productID: v.joi.string(),
            count: v.joi.number()
        })).required()
    });

    v.validate(data, schema, callback);
}

