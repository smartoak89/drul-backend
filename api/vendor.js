var db = require('../libs/datastore')('vendor');

module.exports = {
    create: function (callback) {
        db.create({name: 'vendor-list'}, callback);
    },
    get: function (criteria, callback) {
        db.findOne(criteria, callback);
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
