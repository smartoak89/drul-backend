var db = require('../libs/datastore')('order');

module.exports = {
    add: function (order, callback) {
        db.create(order, callback);
    },
    list: function (criteria, callback) {
        db.findAll(criteria, callback);
    },
    update: function (id, order, callback) {
        db.update(id, order, callback);

    },
    find: function (criteria, callback) {
        db.findOne(criteria, function (err, order) {
            if (err) return callback(err);
            if (!order) return callback(null);
            callback(null, order)
        });
    },
    delete: function (id, callback) {
        db.remove(id, callback);
    }
};
