var db = require('../libs/datastore')('templates');

module.exports = {
    create: function (data, next, callback) {
        console.log('data', data);
        db.create(data, function (err, result) {
            if (err) return next(err);
            callback(result)
        })
    },
    list: function (next, callback) {
        db.list(function (err, results) {
            if (err) return next(err);
            callback(results);
        });
    },
    update: function (id, data, next, callback) {
        db.find(id, function (err, result) {
            if (err) return next(err);
            if (!result) return callback('Шаблон не найден');

            for (var k in data) {
                result[k] = data[k];
            }
            result.save();
            callback(null, result);
        })
    },
    remove: function (id, next, callback) {
        db.find(id, function (err, result) {
            if (err) return next(err);
            if (!result) return callback('Шаблон не найден');
            result.remove();
            callback(null, "Шаблон успешно удален");
        });
    }
};