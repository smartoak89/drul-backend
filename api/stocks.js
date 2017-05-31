var db = require('../libs/datastore')('stocks');
var HttpError = require('../error').HttpError;
var Promise = require('bluebird');
var ProductAPI = require('../api/product');

module.exports = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    list: function (data, callback) {
        db.list(data, callback);
    },
    remove: function (id, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(null);

            ProductAPI.findAll({'stock.stock_id': result.uuid}, function (err, products) {
                if (err) return (err);
                if (products) Promise.map(products, deleteStockFromProduct);
            });

            db.remove(id, callback);

        });
    },
    get: function (criteria, next, callback) {
        db.findOne(criteria, function (err, res) {
            if (err) return next (err);
            callback(res);
        })
    }
};

var deleteStockFromProduct = Promise.promisify(function (product, i, c, cb) {
    product.price = product.stock.old_price;
    product.stock = '';
    product.group = '';
    ProductAPI.update(product.uuid, product, function (err) {
        if (err) return cb(err);
        cb();
    });
});