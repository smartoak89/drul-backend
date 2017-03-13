var userAPI = require('../api/user');
var msg = require('../message/ru/user');
var HttpError = require('../error/index').HttpError;
var mailAPI = require('../api/mail');

exports.register = function (req, res, next) {
    isValid(req.body, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        userAPI.findOne({}, function (err, users) {
            if (err) return next(err);
            if (!users) value.permission = 'administrator';

            userAPI.findOne({email: value.email}, function(err, result) {
                if (err) return next(err);
                if (result) return res.status(400).json('Пользователь с email уже существует');

                userAPI.create(value, function (err, user) {
                    if (err) return next(err);
                    if (!user) return res.status(500);

                    mailAPI.welcome(value.email, function (err, info) {
                        if (err) {
                            console.log('error send mail', err);
                            next(err);
                        }
                    });

                    res.json(user);
                })
            });
        })

    });
};

exports.list = function (req, res, next) {
    userAPI.list(function (err, result) {
        if (err) return next(err);
        var users = result.map(function (i) {
            return viewData(i);
        });
        res.json(users);
    });
};

exports.update = function (req, res, next) {
    isValidUpdate(req, function (err, value) {
        if (err) return res.status(400).json(value);
        var id = req.params.id;

        userAPI.find(id, function (err, user) {
           if (err) return next(err);
           if (!user) return res.status(404).json({message: 'User Not Found'});
           if (!user.checkPassword(value.password)) return res.status(400).json({message: 'Неверный пароль!'});

            userAPI.update(id, value, function (err, newUser) {
                if (err) return next(err);
                res.json(newUser);
            });
        });
    });
};

exports.remove = function (req, res, next) {
    userAPI.remove(req.params.id, function(err) {
        if (err) return next(err);
        res.sendMsg(msg.DELETED);
    })
};

exports.find = function (req, res, next) {
    userAPI.find(req.params.id, function (err, result) {
        if (err) return next(err);
        if (!result) return next(new HttpError(404, 'User Not Found'));
        var data = viewData(result);
        res.json(data);
    })
};

exports.auth = function (req, res, next) {
    isValidAuth(req, function (err) {
        if (err) return res.status(400).json(err);
        userAPI.auth(req.body.email, req.body.password, function (err, user) {
            if (err) return next(err);
            if (!user) return res.status(404).json({message: 'Неверная комбинация логин/пароль'});

            res.json(user);
        })
    });
};

exports.getAuthUser = function (req, res, next) {
    if (!req.user) return res.status(404);

    res.json(req.user);
};

function viewData (data) {
    var res = {
        uuid: data.uuid,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        created: data.created,
        currency: data.currency
    };
    return data;
}

function isValidUpdate (req, callback) {
    var v = require('../libs/validator');

    var data = {
        country: req.body.country,
        email: req.body.email.toLowerCase(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        password: req.body.password,
        permission: req.body.permission
    };

    var schema = v.joi.object().keys({
        country: v.joi.string(),
        email: v.joi.string().email().required(),
        firstname: v.joi.string().max(30),
        lastname: v.joi.string().max(30),
        phone: v.joi.number(),
        permission: v.joi.string(),
        password: v.joi.string().min(4).required()
    });

    v.validate(data, schema, callback);
}

function isValid (body, callback) {
    var v = require('../libs/validator');
    var data = {
        email: body.email.toLowerCase(),
        password: body.password
    };

    var schema = v.joi.object().keys({
        email: v.joi.string().email().required(),
        password: v.joi.string().required()
    });

    v.validate(data, schema, callback);
}

function isValidAuth (req, callback) {
    var v = require('../libs/validator');
    var data = {
        email: req.body.email,
        password: req.body.password
    };

    var schema = v.joi.object().keys({
        email: v.joi.string().email().required(),
        password: v.joi.string().regex(/^[a-zA-Z0-9-_]{4,30}$/).required()
    });

    v.validate(data, schema, callback);
}

