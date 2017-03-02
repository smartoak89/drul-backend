

module.exports = {
    set: function (user) {
        var token = generator();

        return token;
    }
};

function generator () {
    return suid(36);
}