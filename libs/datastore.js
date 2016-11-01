var conf = require('../conf/index');
var uuid = require('uuid');

function Datastore (model) {
    this.model = require('../models/' + model);
}

Datastore.prototype = {
    list: function(callback) {
        this.model.find({}, function (err, result) {
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
            console.log('Saved data => ', JSON.stringify(result));
            return callback(null, result);
        })
    },
    update: function (id, data, callback) {
        var self = this;
        this.find(id, function (err) {
            if (err) return callback(err);
            console.log('updatedData', data);
            self.model.update({uuid: id}, data, function (err, result) {
                if (err) return callback(err);
                if (!result) return callback(500);
                console.log('Updated data => ', JSON.stringify(result));
                return callback(null, result);
            })
        });
    },
    remove: function (id, callback) {
        var self = this;
        this.find(id, function (err, result) {
            if (err) return callback(err);
            self.model.remove(result, function (err, result) {
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
    findAll: function (patern, callback) {
        this.model.find(patern, function (err, result) {
            if (err) return callback(err);
            return callback(null, result);
        })
    }
};

module.exports = function (model) {
    return new Datastore(model)
};