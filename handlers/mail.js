var mailAPI = require('../api/mail');
var userAPI = require('../api/user');

module.exports = {
    add: function (req, res, next) {

        validate(req.body, function (err) {
            if (err) return err(res, 400, err);


        });

    },
    sendMailToUser: function (req, res, next) {

        mailAPI.sendMail()
        // var userId = req.params.userId;
        //
        // userAPI.find(userId, function (err, user) {
        //     if (err) return next(err);
        //     if (!user) return error(res, 404, 'User Not Found');
        //
        //     validSendMail(req.body, function(err) {
        //         if (err) return error(res, 400, err);
        //
        //         mailAPI.sendMail(sanitize(req.body), user, function (err, res) {
        //             if (err) return next(err);
        //             res.json({message: 'Письмо успешно отправлено' + res});
        //         })
        //     })
        // });
    }
};

function error (res, status, msg) {
    return res.status(status).json({message: msg});
}

function sanitize (body) {
    return {
        name: body.name,
        text: body.text,
        subject: body.subject
    }
}

function validate (mail, callback) {
    console.log('mail', mail);
    if (!mail.name) return callback('Отсутствует название Email');

    if (!mail.text) return callback('Отсутствует текст Email');

    // mailAPI.get({name: mail.name}, function (err, email) {
    //     if (err) {
    //         callback(err);
    //     }
    //     if (email) {
    //         callback('Email с таким именем уже существует');
    //     }
    // });

    callback();

}

function validSendMail(mail, callback) {
    if (!mail.subject) return callback('Укажите тему Email');
    if (!mail.text) return callback('Напишите текст Email');
    callback();
}