var db = require('../libs/datastore')('setting');

module.exports = {
    add: function (data, next, callback) {

        db.create(data, function (err, result) {
            if (err) return next(err);
            callback(result);
        })
    },
    getSetting: function (next, callback) {
        db.findOne({}, function (err, result) {
            if (err) return next(err);
            callback(result);
        })
    }
};