var db = require('../libs/datastore')('product');
var HttpError = require('../error').HttpError;
var error = require('../error').ressError;
var Promise = require('bluebird');

module.exports = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    list: function (callback) {
        var self = this;
        db.list(function (err, result) {
            if (err) return callback(err);
            callback(null, result);
            // configureProduct(result).then(function () {
            //     callback(null, result);
            // }).catch(function (err) {
            //     callback(err);
            // });
        });
    },
    update: function (id, data, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'Product Not Found'));
            for (var k in data) {
                if (typeof data[k] !== 'undefined') {
                    result[k] = data[k];
                }
            }
            db.update(result.uuid, result, callback);
        })
    },
    remove: function (id, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'Product Not Found'));
            db.remove(id, function (err) {
                if (err) return callback(err);
                removeFromCartAndDeferred(id, callback);
            });
        });
    },
    findOne: function (document, callback) {
        var self = this;
        db.findOne(document, function (err, product) {
            if (err) return callback(err);
            callback(null, product);
            // configureProduct([result]).then(function () {
            //     callback(null, result);
            // }).catch(function (err) {
            //     callback(err);
            // });
        })
    },
    findAll: function (document, callback) {
        db.findAll(document, callback);
    },
    filter: function (req, callback) {
        var criteria = {};
        for (key in req.body) {
            criteria[key] = {$in: req.body[key]}
        }
        db.findAll(criteria, callback);
    }
};

function removeFromCartAndDeferred(productID, callback) {
    var Promise = require('bluebird');
    var cartAPI = require('./cart');
    var deferredAPI = require('./deferred');

    Promise.mapSeries([cartAPI.deleteAll, deferredAPI.deleteAll], Promise.promisify(function (i,e,c,cb) {
        i(productID, function (err) {
            if (err) return cb(err);
            cb();
        })
    })).then(function () {
        callback();
    }).catch(function (err) {
        callback(err);
    });
}

var configureProduct = Promise.promisify(function (list, callback) {
    var fileAPI = require('./file');
    var _ = require('lodash');

    Promise.map(list, Promise.promisify(function (product, i, c, cb) {
        fileAPI.findAll({parent: product.uuid}, function (err, gall) {
            if (err) return callback(500);
            product.photo = _.find(gall, {type: 'main'});
            product.gallery = gall;
            cb();
        });
    })).then(function () {
        callback();
    });
});
