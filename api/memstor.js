var redisCli = require('../libs/redis');

module.exports = {
    set: function (key, value) {
        redisCli.set(key, value);
    },
    get: function (key, callback) {
        redisCli.get(key, function (err, res) {
            if (err) return callback(err);
            callback(null, res);
        })
    },
    remove: function (key) {
        redisCli.del(key);
    }
};