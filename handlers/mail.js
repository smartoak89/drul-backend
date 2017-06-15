var mailAPI = require('../api/mail');
var orderAPI = require('../api/order');

module.exports = {
    send: function (req, res, next) {

        validate(sanitize(req.body), function (err, body) {

            if (err) return error(res, 400, err);

            mailAPI.sendLetter(body, res, next);

            res.end();
        })
    },
    status: function (req, res, next) {
        var orderId = req.params.order;

        orderAPI.find({uuid: orderId}, function (err, order) {
            if (err) return next(err);
            if (!order) return res.status(404).json({message: 'Заказ не найден'});

            if (!order.email || order.email === '') return res.end();

            mailAPI.sendStatus(order, next);

            res.end();
        });


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