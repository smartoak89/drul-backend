var db = require('../libs/datastore')('combination');
var HttpError = require('../error').HttpError;

module.exports = {
    create: function (combination, callback) {
        db.create(combination, callback);
    },
    list: function (criteria, callback) {
        db.findAll(criteria, callback);
    },
    update: function (comb, data, callback) {
        db.findOne(comb, function (err, combination) {
            if (err) return callback(err);
            if (!combination) return callback(null);
            combination.name = data.name;
            combination.value = data.value;
            combination.slug = data.slug;
            db.update(combination.uuid, combination, callback);
        })
    },
    delete: function (id, callback) {
        db.remove(id, callback);
    }
};
