var db = require('../libs/datastore')('cart');
var Promise = require('bluebird');

module.exports = {
    add: function (id, user, callback) {
        var data = {
            productID: id,
            owner: user
        };
        db.create(data, callback);
    },
    list: function (criteria, callback) {
        db.findAll(criteria, function (err, list) {
            if (err) return callback(err);

            var productAPI = require('./product');

            var listProducts = [];
            Promise.map(list, Promise.promisify(function (i,a,b,cb) {
                console.log(i.productID);
                productAPI.findOne({uuid: i.productID}, function (error, product) {
                    if (error) return callback(error);
                    listProducts.push(product);
                    cb();
                })
            })).then(function () {
                callback(null, listProducts);
            }).catch(function (err) {
                callback(err);
            })
        });
    }
};