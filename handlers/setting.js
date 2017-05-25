var settingAPI = require('../api/setting');

exports.edit = function (req, res, next) {
    isValid(req.body, function (err, data) {

        if (err) return res.status(400).json({message: err});

        settingAPI.getSetting(next, function (result) {
            if (!result){
                settingAPI.add(data, next, function (setting) {
                    res.json(setting);
                })
            } else {
                for(var key in data) {
                    result[key] = data[key]
                }

                result.save();

                res.json(result);
            }

        });

    });
};

exports.getSetting = function (req, res, next) {
    settingAPI.getSetting(next, function (result) {
        res.json(result);
    });
};

function isValid (body, callback) {
    var v = require('../libs/validator');

    var data = {
        monitoring: body.monitoring
    };

    var schema = v.joi.object().keys({
        monitoring: v.joi.number()
    });

    v.validate(data, schema, callback);
}