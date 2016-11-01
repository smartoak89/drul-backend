var db = require('../libs/datastore')('user');
var HttpError = require('../error').HttpError;

module.exports = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    list: function (callback) {
        db.list(callback);
    },
    update: function (id, data, callback) {
        db.find(id, function (err, user) {
            if (err) return callback(err);
            if (!user) return callback(new HttpError(404, 'User Not Found'));
            if (!user.checkPassword(data.password)) return callback(HttpError(400, 'Неверный пароль'));
            for (var k in data) {
                if (typeof data[k] !== 'undefined') {
                    user[k] = data[k];
                }
            }
            console.log('User data for update => ', JSON.stringify(user));
            db.update(user.uuid, user, callback);
        })
    },
    remove: function (id, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(404);
            db.remove(id, callback);
        });
    },
    find: function (id, callback) {
        db.find(id, callback);
    },
    auth: function (email, password, callback) {
        db.findOne({email: email}, function (err, user) {
            if (err) return callback(err);
            if (!user) return callback(null);
            if (!user.checkPassword(password)) return callback();
            console.log('Got user =>', user);
            return callback (null, user);
        });
    },
    findOne: function (data, callback) {
        db.findOne (data, callback);
    }
};
