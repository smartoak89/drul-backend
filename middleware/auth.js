var memstor = require('../api/memstor');

module.exports = function (req, res, next) {
    var header = req.headers['authorization'];

    if (!header) {
        res.status(401).json({message: "Not Authorized"})
    }

    var checkInMemstor = memstor.get('token-' + header, function (err, user) {
        if (err) return next(err);

        if (!user) res.status(401).json({message: 'Incorrect token'});

        req.user = JSON.parse(user);

        console.log(req.user);

        next();
    })
};