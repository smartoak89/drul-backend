var db = require('../libs/datastore')('delivery');

module.exports = {
    add: function (method, res, next , callback) {
        db.create(method, function (err, result) {
            if (err) return next(err);
            callback(result)
        });
    },
    list: function (res, next, callback) {
        db.list(function (err, result) {
            if (err) return next(err);
            callback(result)
        });
    },
    find: function (id, res, next, callback) {
        db.find(id, function (err, result) {
            if (err) return next (err);

            if (!result) return res.status(404).json({message: 'Способ доставки не найдет'});

            callback(result);
        })
    },
    edit: function (id, data, res, next, callback) {
        this.find(id, res, next, function (result) {

            for (var key in data) {
                result[key] = data[key]
            }

            result.save();

            callback(result);
        })
    }
};
