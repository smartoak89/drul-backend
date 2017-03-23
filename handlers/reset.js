var logger = require('../libs/logger')(module);
var productApi = require('../api/product');
var userApi = require('../api/user');
var memstorAPI = require('../api/memstor');
var mailApi = require('../api/mail');

exports.sendResetToMail = function (req, res, next) {

    isValid(req.body, function (err, data) {

        if (err) return res.status(400).json({message: err});

        userApi.findOne({email: data.email}, function (err, user) {

            if (err) return next(err);

            if (!user) return res.status(404).json({message: 'Пользователь с таким email не найден'});

            sendMail(user, res, next);
        })
    })
};

exports.checkTtlLink = function (req, res, next) {

    var token = req.params.token;

    checkTokenLink(token, res, next, function (id) {
        res.json({id: id});
    });

};

exports.resetPasswd = function (req, res, next) {

    var token = req.params.token;

    checkTokenLink(token, res, next, function (id) {
        var password = req.body.password;

        if (!password) return res.status(400).json({message: 'Неназначен новый пароль'});

        userApi.findOne({uuid: id}, function (err, user) {
            if (err) return next(err);

            if (!user) return res.status(404).json({message: 'Пользователь не найден'});

            user.password = password;

            user.save(function (err, saved) {
                if (err) return next(err);

                memstorAPI.remove('reset_url-' + token);

                res.json({id: saved.uuid});
            });
        })
    });
};

function checkTokenLink (token, res, next, callback) {
    var urlToken = 'reset_url-' + token;

    memstorAPI.get(urlToken, next, function (userID) {
        if (!userID) return res.status(404).json({message: 'Неверный токен для востановления пароля'});

        callback(userID);
    });
}

function sendMail (user, res, next) {

    var token = require('rand-token').suid(10);

    var urlToken = 'reset_url-' + token;

    memstorAPI.set(urlToken, user.uuid);
    memstorAPI.expire(urlToken, 3600);

    var opt = {
        email: user.email,
        link: token
    };

    mailApi.reset(opt, res, next);
}

function isValid (body, callback) {
    var v = require('../libs/validator');

    var data = {
        email: body.email.toLowerCase()
    };

    var schema = v.joi.object().keys({
        email: v.joi.string().email().required()
    });

    v.validate(data, schema, callback);
}