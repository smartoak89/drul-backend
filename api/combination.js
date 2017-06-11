var db = require('../libs/datastore')('combination');
var productAPI = require('./product');
var Promise = require('bluebird');


module.exports = {
    create: function (combination, callback) {
        db.create(combination, callback);
    },
    list: function (criteria, callback) {
        db.findAll(criteria, callback);
    },

    update: function (comb, data, callback) {
        db.findOne(comb, function (err, combination) {
            if (err) return callback(err);
            if (!combination) return callback(null);

            productAPI.findAll({'combo.slug': combination.slug}, function (err, products) {
                Promise.map(products, updateProductCombo(combination, data)).then(function () {
                    combination.name = data.name;
                    combination.value = data.value;
                    combination.slug = data.slug;

                    db.update(combination.uuid, combination, callback);
                }).catch(function (err) {
                    return callback(err);
                })
            });

        })
    },
    updateValue: function (id, ind, value, callback) {
        db.findOne({uuid: id}, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(null);

            productAPI.findAll({'combo.slug': result.slug}, function (err, products) {
                Promise.map(products, updateProductComboValue(result.slug, result.value[ind], value)).then(function () {
                    result.value[ind] = value;
                    db.update(id, result, callback);
                }).catch(function (err) {
                    return callback(err);
                })
            });

        })
    },
    delete: function (id, callback) {
        db.remove(id, callback);
    }
};

var updateProductCombo = function (oldC, newC) {
    return Promise.promisify(function (p, ind, arr, cb) {
        p.combo.filter(function (item) {
            if (item.slug == oldC.slug) {
                item.slug = newC.slug;
                item.name = newC.name;
            }
        });
        productAPI.update(p.uuid, p, function (err) {
            if (err) return cb(err);
            cb();
        })
    })
};

var updateProductComboValue = function (slug, oldV, newV) {
    return Promise.promisify(function (p, ind, arr, cb) {
        p.combo.filter(function (item) {
            if (item.slug == slug && item.values) {
                var finded = item.values.indexOf(oldV);
                if (finded !== -1) {
                    item.values[finded] = newV;
                }
            }
        });
        productAPI.update(p.uuid, p, function (err) {
            if (err) return cb(err);
            cb();
        })
    })
};
