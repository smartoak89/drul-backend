var userAPI = require('../api/user');
var mailAPI = require('../api/mail');
var memstor = require('../api/memstor');

exports.register = function (req, res, next) {
    isValid(req.body, function (err, value) {

        if (err) return res.status(400).json(err);

        checkAdminExists(next, function (exists) {

            if (!exists) value.permission = 'administrator';

            userAPI.findOne({email: value.email}, function(err, result) {
                if (err) return next(err);
                if (result) return res.status(400).json('Пользователь с email уже существует');

                userAPI.create(value, function (err, user) {
                    if (err) return next(err);
                    if (!user) return res.status(500);

                    mailAPI.welcome(value.email, next);

                    memstor.set('first_user', true);

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

exports.getUserByToken = function (req, res, next) {
    var header = req.headers['authorization'];
    var token = 'token-' + header;
    memstor.get(token, next, function (userCli) {

        if (!userCli) return res.status(404).json({message: 'User Not Found'});

        var user = JSON.parse(userCli);
        userAPI.find(user.uuid, function (err, result) {
            if (err) return next(err);
            var user = {
                uuid: result.uuid,
                email: result.email,
                firstname: result.firstname,
                lastname: result.lastname,
                email: result.email,
                country: result.country,
                ballance: result.ballance,
                phone: result.phone,
                permission: result.permission
            };
            res.json(user);
        })


    })
};

exports.updateAdmin = function (req, res, next) {
    isValidUpdateAdmin(req, function (err, value) {
        if (err) return res.status(400).json(err);
        var id = req.params.id;

        userAPI.find(id, function (err, user) {
            console.log('error', err);
           if (err) return next(err);
           if (!user) return res.status(404).json({message: 'User Not Found'});

            userAPI.update(id, value, function (err, newUser) {
                if (err) return next(err);
                res.json(newUser);
            });
        });
    });
};

exports.update = function (req, res, next) {
    isValidUpdate(req, function (err, value) {
        if (err) return res.status(400).json(err);
        var id = req.params.id;

        userAPI.find(id, function (err, user) {
            console.log('error', err);
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
    userAPI.find(req.params.id, function(err, user) {
        if (err) return next(err);
        if (!user) return ('Пользователь не найден');
        user.remove();
        res.json({message: 'Пользователь удален успешно'});
    })
    // userAPI.remove(req.params.id, function(err, result) {
    //     if (err) return next(err);
    //     if (!result)
    //     res.json({message: 'Пользователь удален успешно'});
    // })
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

function checkAdminExists (next, callback) {

    memstor.get('first_user', next, function (firstUser) {

        if (firstUser) return callback(true);

        userAPI.findOne({}, function(err, user) {
            if (err) return next(err);

            if (user) return callback(true);

            callback();
        });
    });
}

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

function isValidUpdateAdmin (req, callback) {
    var v = require('../libs/validator');

    console.log('data', req.body);
    var data = {
        ballance: req.body.ballance
    };

    var schema = v.joi.object().keys({
        ballance: v.joi.object().keys({
            amount: v.joi.number(),
            currency: v.joi.string().max(3)
        })
    });

    v.validate(data, schema, callback);
}
function isValidUpdate (req, callback) {
    var v = require('../libs/validator');

    console.log('data', req.body);
    var data = {
        country: req.body.country,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        password: req.body.password,
        permission: req.body.permission,
        ballance: req.body.ballance
    };

    var schema = v.joi.object().keys({
        country: v.joi.string(),
        email: v.joi.string().email().lowercase().required(),
        firstname: v.joi.string().max(30),
        lastname: v.joi.string().max(30),
        phone: v.joi.number(),
        permission: v.joi.string(),
        ballance: v.joi.number(),
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

