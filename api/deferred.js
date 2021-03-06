var db = require('../libs/datastore')('deferred');
var HttpError = require('../error').HttpError;

module.exports = {
    add: function (user, product, callback) {
        var data = {
            owner: user,
            product: product
        };
        db.create(data, callback);
    },
    list: function (criteria, callback) {
        db.findAll(criteria, function (err, list) {
            if (err) return callback(err);
            getProductsFromDeferred(list, callback);

        });
    },
    delete: function (document, callback) {
        db.findOne(document, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(null);
            db.remove(result.uuid, callback);
        });
    },
    find: function (criteria, callback) {
        db.findOne(criteria, function (err, result) {
            if (err) return callback(err);
            callback(null, result);
        });
    },
    deleteAll: function (productID, callback) {
        db.findAll({product: productID}, function (err, res) {
            if (err) return callback(err);
            if (!res) return callback();

            var Promise = require('bluebird');
            Promise.map(res, Promise.promisify(function (i, e, c, cb) {
                db.remove(i.uuid, cb);
            })).then(function () {
                callback();
            }).catch(function(err) {
                callback(err);
            });
        });
    }
};

function getProductsFromDeferred (list, callback) {
    var Promise = require('bluebird');
    var productAPI = require('./product');

    Promise.map(list, Promise.promisify(function (i,a,b,cb) {
        console.log(i.product);
        productAPI.findOne({uuid: i.product}, function (error, product) {
            if (error) return callback(error);
            // product.created = i.created;
            cb(null, product);
        })
    })).then(function (list) {
        callback(null, list);
    }).catch(function (err) {
        callback(err);
    })
}