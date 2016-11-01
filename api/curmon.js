var db = require('../libs/datastore')('curmon');

module.exports = {
    createEdit: function (percent, callback) {
        var curmon = {name: 'curmon'};

        db.findOne(curmon, function (err, data) {
            if (err) return callback(err);
            curmon.percent = percent;
            if (!data) {
                db.create(curmon, callback);
            } else {
                db.update(data.uuid, curmon, callback);
            }
        });
    },
    get: function (callback) {
        db.findOne({name: 'curmon'}, callback);
    }
};