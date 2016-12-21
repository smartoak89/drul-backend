var filterAPI = require('../api/filter');

exports.get = function (req, res, next) {
    filterAPI.get(req.params.category, function (err, filter) {
        if (err) return next(err);
        if (!filter) return res.status(500);
        res.json(filter);
    });
};