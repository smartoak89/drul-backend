/**
 * Created by yura on 11.03.17.
 */

var memstor = require('../api/memstor');


module.exports = function (req, res, next) {
    var header = req.headers['authorization'];

    if (!header) {
        return res.status(401).json({message: "Not Authorized"})
    }

    var token = 'token-' + header;
    var user;

    memstor.get(token, function (err, userCli) {
        if (err) return next(err);

        if (!userCli) return res.status(401).json({message: 'Incorrect token'});

        user = JSON.parse(userCli);

        extendExspire();

        if (user.permission != 'administrator') {
            return res.status(401).json({message: 'You are not access permission'});
        }

        req.user = user;

        next();
    })

    function extendExspire () {
        var sec = 60 * 60 * 24;

        memstor.expire(token, sec);
        memstor.expire('user-' + user.uuid, sec);
    }
};