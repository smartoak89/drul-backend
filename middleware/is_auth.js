var memstor = require('../api/memstor');


module.exports = function (req, res, next) {
    var header = req.headers['authorization'];

    if (!header) {
        return res.status(401).json({message: "Not Authorized"})
    }

    memstor.get('token-' + header, function (err, user) {
        if (err) return next(err);

        if (!user) return res.status(401).json({message: 'Incorrect token'});

        var user = JSON.parse(user);

        req.user = user;

        next();
    })
};
