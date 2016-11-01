var db = require('../libs/datastore')('deferred');
var HttpError = require('../error').HttpError;

module.exports = {
    add: function (req, callback) {
        var prodId = req.params.id;
        var userId = req.body.user;

        var userAPI = require('./user');
        userAPI.find(userId, function (err, user) {
            if (err) return callback(err);
            if (!user) {
                return callback(404);
            }

            var productAPI = require('./product');
            productAPI.findOne({uuid: prodId}, function (err, prod) {
                if (err) return callback(err);
                db.findOne({parent: userId, productId: prod.uuid}, function (err, deferred) {
                    if (err) return callback(err);

                    if (!deferred) {
                        return db.create({productId: prod.uuid, parent: userId}, function (err, res) {
                            if (err) return callback (err);
                            callback(null, res);
                        })
                    }
                    callback(null);
                });
            })
        });
    },
    list: function (id, callback) {
        var userAPI = require('./user');
        userAPI.find(id, function (err, user) {
            if (err) return callback(err);
            if (!user) {
                console.log('found user', user);
                return callback(new Error('User Not Found'));
            }
            db.findAll({parent: id}, function (err, result) {
                if (err) return callback(err);
                getProducts(result, callback);
            })
        });
    },
    delete: function (id, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'Product Not Found'));
            db.remove(id, callback);
        });
    }
};

function getProducts (deferrent, callback) {
    var productAPI = require('./product');
    var Promise = require('bluebird');

    Promise.map(deferrent, Promise.promisify(function (prod, i, b, cb) {
        productAPI.findOne({uuid: prod.productId}, function (err, product) {
            if (err) return callback(err);
            product.diferredId = prod.uuid;
            return cb(null, product);

        });
    })).then(function (res) {
        callback(null, res);
    })
}