var db = require('../libs/datastore')('user');
var memstor = require('./memstor');

module.exports = {
    create: function (data, callback) {
        db.create(data, function (err, user) {
            if (err) return callback(err);

            generatorToken(user, callback);
        })
    },
    list: function (callback) {
        db.list(callback);
    },
    update: function (id, data, callback) {
        db.find(id, function (err, user) {
            for (var k in data) {
                if (typeof data[k] !== 'undefined') {
                    user[k] = data[k];
                }
            }
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

            generatorToken(user, callback);

        });
    },

    findOne: function (data, callback) {
        db.findOne (data, callback);
    }
};

function generatorToken (user, callback) {
    var suid = require('rand-token').suid;
    var token = suid(36);

    memstor.get('user-' + user.uuid, function (err, res) {
        if (err) return callback(err);
        if (res) memstor.remove(res);

        memstor.set('token-' + token, JSON.stringify(sanitazeToSave(user)));
        memstor.set('user-' + user.uuid, 'token-' + token);

        callback (null, {token: token});
    })
}

function sanitazeToSave (user) {
    return {
        uuid: user.uuid,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        permission: user.permission,
        created: user.created
    }
}
