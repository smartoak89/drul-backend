var suid = require('rand-token').suid;

var tokens = {};

module.exports = {
    set: function (id) {
        var token = generator();
        tokens[token] = id;
        return token;
    }
};

function generator () {
    return suid(36);
}