var memstor = require('../api/memstor');


module.exports = function (req, res, next) {
    var header = req.headers['authorization'];

    if (!header) {
        return res.status(401).json({message: "Not Authorized"});
    }

    var token = 'token-' + header;
    var user;

    memstor.get(token, next, function (userCli) {

        if (!userCli) return res.status(401).json({message: 'Incorrect token'});

        user = JSON.parse(userCli);

        extendExspire();

        req.user = user;

        next();
    });

    function extendExspire () {
        var sec = 60 * 60 * 24;

        memstor.expire(token, sec);
        memstor.expire('user-' + user.uuid, sec);
    }
};
