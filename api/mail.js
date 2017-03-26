var db = require('../libs/datastore')('mail');
var conf = require('../conf');
var mailer = require('nodemailer');
var path = require('path');
var thenJade = require('then-jade');

module.exports = {

    welcome: function (email, next) {

        var tpl = conf.rootDir + '/templates/register.jade';

        thenJade.renderFile(tpl, {} , function (err, html) {
            if (err) return next(err);

            var to = '<' + email + '>';

            var subject = 'Регистрация на сайте.';

            var createMail = new CreateMail(to, subject, html);

            createMail.send(next);
        })


    },
    reset: function (data, res, next) {

        var tpl = conf.rootDir + '/templates/reset.jade';
        var link = conf.frontend.url + '/reset/' + data.link

        thenJade.renderFile(tpl, {link: link} , function (err, html) {
            if (err) return next(err);

            var to = '<' + data.email + '>';

            var subject = 'Востановление пароля.';

            var createMail = new CreateMail(to, subject, html);

            res.json({message: 'Инструкции отправлены на указанный вами email'});

            createMail.send(next);
        })
    },
    sendLetter: function (data, res, next) {
        var tpl = conf.rootDir + '/templates/letter.jade';

        thenJade.renderFile(tpl, {text: data.text} , function (err, html) {
            if (err) return next(err);

            var to = '<' + data.email + '>';

            var subject = data.subject;

            var createMail = new CreateMail(to, subject, html);

            res.json({message: 'Сообщение успешно отправлено'});

            createMail.send(next);
        })
    },
    newOrder: function (data, next) {
        var tpl = conf.rootDir + '/templates/order.jade';

        var property = {
            price: data.price,
            currency: data.currency,
            order_num: data.order_num
        };

        thenJade.renderFile(tpl, property , function (err, html) {
            if (err) return next(err);

            var to = '<' + data.email + '>';

            var subject = 'Новый заказ № ' + data.order_num;

            var createMail = new CreateMail(to, subject, html);

            createMail.send(next);
        })
    }
};

function CreateMail (to, subject, html) {

    this.transport = mailer.createTransport({
        service: conf.mail.service,
        auth: {
            user: conf.mail.auth.user,
            pass: conf.mail.auth.pass
        }
    }, {
        from : conf.mail.from
    });

    this.message = {
        to: to,
        subject: subject,
        html: html
    };
}

CreateMail.prototype = {

    send: function (next) {
        var self = this;

        this.transport.sendMail(this.message, function (err, info) {
            if (err) return next(err);
            self.close();
        });
    },
    close: function () {
        this.transport.close();
    }
};

function createTransport() {

    return mailer.createTransport({
        service: conf.mail.service,
        auth: {
            user: conf.mail.auth.user,
            pass: conf.mail.auth.pass
        }
    }, {
        from : conf.mail.from
    });
}