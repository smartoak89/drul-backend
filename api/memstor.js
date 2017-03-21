var redisCli = require('../libs/redis');

module.exports = {
    set: function (key, value) {
        redisCli.set(key, value);
    },
    get: function (key, next, callback) {
        redisCli.get(key, function (err, res) {
            if (err) return next(err);
            callback(res);
        })
    },
    remove: function (key) {
        redisCli.del(key);
    },
    expire: function (key, sec) {
        redisCli.expire(key, sec);
    }
};