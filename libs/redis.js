var conf = require('../conf');

var client  = require('redis').createClient({
    host: conf.redis.host,
    port: conf.redis.port
});

client.on('connect', function () {
    console.info('redis is connected!');
});

client.on('error', function (err) {
    console.log('redis err', err);
    throw new Error(err);
});

module.exports = client;