var db = require('../libs/datastore')('slider');

module.exports = {
    add: function (data, callback) {
        db.create(data, callback);
    },
    list: function (callback) {
        db.list(callback);
    },
    find: function (slide, callback) {
        db.findOne(slide, callback);
    },
    update: function (id, data, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            for (var i in data) {
                if (typeof data[i] !== 'undefined') {
                    result[i] = data[i];
                }
            }
            db.update(result.uuid, result, callback);
        })
    },
    remove: function (id, callback) {
        db.remove(id, callback);
    }
}
;