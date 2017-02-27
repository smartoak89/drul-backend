var conf = require('../conf/index');
var uuid = require('uuid');

function Datastore (model) {
    this.model = require('../models/' + model);
}

Datastore.prototype = {
    list: function(callback) {
        this.model.find(function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(500);
            return callback(null, result);
        })
    },
    find: function (id, callback) {
        this.model.findOne({uuid: id}, function (err, result) {
            if (err) return callback(err);
            return callback(null, result);
        })
    },
    create: function (data, callback) {
        if (!data.uuid) data.uuid = uuid.v4();
        var model = new this.model(data);
        model.save(data, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(500);
            return callback(null, result);
        })
    },
    update: function (id, data, callback) {
        var self = this;
        self.model.update({uuid: id}, data, function (err, result) {
            if (err) return callback(err);
            return callback(null, data);
        });
    },
    remove: function (id, callback) {
        var self = this;
        this.find(id, function (err, result) {
            if (err) return callback(err);
            self.model.remove({uuid: result.uuid}, function (err, result) {
                if (err) return callback(err);
                return callback(null, result);
            })
        })
    },
    findOne: function (document, callback) {
        this.model.findOne(document, function (err, result) {
            if (err) return callback(err);
            return callback(null, result);
        })
    },
    findAll: function (criteria, callback) {
        var limit;
        var sort;
        if (criteria.limit){
            limit = criteria.limit;
            delete criteria.limit;
        }
        if (criteria.sort) {
            sort = criteria.sort;
            delete criteria.sort;
        }
        this.model.find(criteria, function (err, result) {
            if (err) return callback(err);
            return callback(null, result);
        }).limit(limit).sort(sort);
    },
    filter: function (filter, callback) {
        console.log('filreer', filter);
        this.model.aggregate(filter , function (err, result) {
            if (err) return callback(err);
            callback(null, result);
        });
    },
    getProductFilter: function (category, callback) {
        this.model.aggregate([{$match: {'category.slug': category}}, {$unwind: '$combo'}, {$unwind: '$combo.values'}, {$group: {_id: '$combo.name', slug: {$first: '$combo.slug'}, values: {$addToSet: '$combo.values'}}} ], function (err, res) {
            if (err) return callback(err);
            callback(null, res);
        })
    },
    search: function(criteria, callback) {
        var search = {};

        for(var key in criteria) {
            search[key] = new RegExp('.*'+ criteria[key], 'i');
        }
        console.log('search', search)
        this.model.find(search, function (err, result) {
            if (err) return callback(err);
            callback(null, result);
        })
    }
};

module.exports = function (model) {
    return new Datastore(model)
};