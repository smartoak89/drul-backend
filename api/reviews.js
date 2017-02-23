var db = require('../libs/datastore')('reviews');
var error = require('../error').ressError;

module.exports = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    findAll: function (criteria, callback) {
        db.findAll(criteria, callback);
    },
    remove: function (id, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(null);
            db.remove(id, function (err, res) {
                if (err) return callback(err);
                callback(null, res);
            });
        });
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
            if (!result) return callback(null);
            for (var k in data) {
                if (typeof data[k] !== 'undefined') {
                    result[k] = data[k];
                }
            }
            db.update(result.uuid, result, callback);
        })
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

    getProductFilter: function (category, callback) {
        db.getProductFilter(category, callback);
    }
};
