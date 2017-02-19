var conf = require('../conf');

var client  = require('redis').createClient({
    host: conf.redis.host,
    port: conf.redis.port
});

client.on('error', function (err) {
    throw new Error('Error connect to redis', err);
});

module.exports = client;