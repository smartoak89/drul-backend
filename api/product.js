var db = require('../libs/datastore')('product');
var HttpError = require('../error').HttpError;
var error = require('../error').ressError;
var Promise = require('bluebird');
var conf = require('../conf');

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
    update: function (id, newData, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'Product Not Found'));

            for (var k in newData) {
                result[k] = newData[k];
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
                // removeFiles();
            });
        });
    },
    findOne: function (document, callback) {
        var self = this;
        db.findOne(document, function (err, product) {
            if (err) return callback(err);
            if (!product) return callback(null);
            callback(null, product);
            // configureProduct([result]).then(function () {
            //     callback(null, result);
            // }).catch(function (err) {
            //     callback(err);
            // });
        })
    },
    findAll: function (criteria, callback) {
        // if (criteria.query) return db.search(criteria.query, callback);
        _find(sanitazeCriteria(criteria), callback);
    },
    getProductFilter: function (category, callback) {
        db.getProductFilter(category, callback);
    },
    updateCategoryPath: function(criteria, next, data, callback){
        var self = this;
        this.findAll(criteria, function (err, results) {
            if (err) return next(err);
            Promise.map(results, function (item) {
                item.category.name = data.name;
                item.category.slug = data.slug;
                self.update(item.uuid, item, function(){});

            }).then(function () {
                callback();
            })
        })
    },
    updateStock: function (criteria, data, next, callback) {
        var self = this;
        this.findAll(criteria, function (err, results) {
            if (err) return next(err);

            Promise.map(results, function (item) {
                item.stock.percent = data.percent;
                item.price = Math.round(item.stock.old_price - ( item.stock.old_price * data.percent / 100 ));
                self.update(item.uuid, item, function(){});
            }).then(function () {
                callback();
            })
        })
    }
};

function sanitazeCriteria (criteria) {
    var obj = {
        match:{}
    };

    if (criteria.category) {
        obj.match["category.slug"] = criteria.category;
        delete criteria.category;
    }

    if(criteria.sort) {
        obj.sort = {};
        var split = criteria.sort.split('.');
        obj.sort[split[0]] = split[1] == 'ask' ? 1 : -1;
        delete criteria.sort;
    }

    if (criteria.limit) {
        obj.limit = Number(criteria.limit);
        delete criteria.limit;
    }

    if(criteria.skip) {
        obj.skip = criteria.skip * obj.limit || conf.product.limit;

        delete criteria.skip;
    }

    if(criteria['combo']) {
        var combo = [];

        if (Array.isArray(criteria['combo'])) {

            criteria['combo'].forEach(function (item) {
                var split = item.split('.');
            });


        } else {
            var split = criteria['combo'].split('.');
        }

        obj.match.$or = combo;

        delete criteria.combo;
    }


    if (criteria.price) {

        if (Array.isArray(criteria.price)) {
            var min = Number(criteria.price[0]);
            var max = Number(criteria.price[1]);

            if (min < max) {
                obj.match.price = {'$gte': min, '$lte': max};
            } else {
                obj.match.price = NaN;
            }
        }else {
            var price = Number(criteria.price);
            obj.match.price = price;
        }

        delete criteria.price;
    }

    if (Object.keys(criteria).length != 0) {
        for (var key in criteria) {
            obj['match'][key] = new RegExp('.*'+ criteria[key], 'i');
        }
    }

    return obj;
}

function _find (criteria, callback) {
    var match = criteria.match;
    var sort = criteria.sort || null;
    var skip = criteria.skip || null;
    // var or = criteria.or || null;
    var limit = criteria.limit || conf.product.limit;
    var filter = [];

    if (match) filter.push({$match: match});
    if (sort)  filter.push({$sort: sort });
    if (skip)  filter.push({$skip: skip});

    filter.push({$limit: limit});
    db.filter(filter, callback);
}

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
