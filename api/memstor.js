var redisCli = require('../libs/redis');

module.exports = {
    set: function (key, value) {
        var self = this;

        redisCli.set(key, value);

        self.expire(key, 60 * 60 * 24);
    },
    get: function (key, callback) {
        redisCli.get(key, function (err, res) {
            if (err) return callback(err);
            callback(null, res);
        })
    },
    remove: function (key) {
        redisCli.del(key);
    },
    expire: function (key, sec) {
        redisCli.expire(key, sec);
    }
};