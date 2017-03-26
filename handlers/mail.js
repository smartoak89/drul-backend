var mailAPI = require('../api/mail');
var userAPI = require('../api/user');

module.exports = {
    send: function (req, res, next) {

        validate(sanitize(req.body), function (err, body) {

            if (err) return error(res, 400, err);

            userAPI.findOne({email: body.email}, function (err, user) {
                if (err) return next(err);

                if (!user) return error(res, 404, 'Пользователя с указанным email не существует');

                mailAPI.sendLetter(body, res, next);
            })

        })
    }
};

function error (res, status, msg) {
    return res.status(status).json({message: msg});
}

function sanitize (body) {
    return {
        email: body.email,
        subject: body.subject,
        text: body.text
    }
}

function validate (body, callback) {
    if (!body.email) return callback('Введите email получателя');
    if (!body.subject) return callback('Введите тему сообщения');
    if (!body.text) return callback('Введите текст сообщения');

    callback(null, body);

}