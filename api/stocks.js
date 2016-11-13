var db = require('../libs/datastore')('stocks');
var HttpError = require('../error').HttpError;

module.exports = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    list: function (data, callback) {
        db.list(data, callback);
    },
    remove: function (id, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(null);
            db.remove(id, callback);
        });
    }
};
