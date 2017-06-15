var db = require('../libs/datastore')('mail');
var conf = require('../conf');
var mailer = require('nodemailer');
var path = require('path');
var thenJade = require('then-jade');
var templateAPI = require('./templates');

module.exports = {

    welcome: function (email, next) {

        var tpl = conf.rootDir + '/templates/register.jade';

        templateAPI.get({slug: 'registracziya'}, function (err, template) {
            if (err) return next(err);

            if(!template) return;

            thenJade.renderFile(tpl, {body: template.body} , function (err, html) {
                if (err) return next(err);

                var to = '<' + email + '>';

                var subject = template.subject;

                var createMail = new CreateMail(to, subject, html);

                createMail.send(next);
            })
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
        var tpl = conf.rootDir + '/templates/letter-test.jade';

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
        var path = conf.rootDir + '/templates/order.jade';
        console.log('data', data);
        var property = {
            price: data.price,
            currency: data.currency,
            order_num: data.order_num,
            user_name: data.firstname + ' ' + data.lastname,
            status: data.status,
            city: data.delivery.city,
            post_number: data.delivery.numberPost
        };

        templateAPI.get({slug: 'zakaz'}, function (err, result) {
            if (err) return next(err);

            if (!result) return;

            var fn = thenJade.compile(result.body, property);

            fn(property, function (err, html) {
                thenJade.renderFile(path, {body: html} , function (err, template) {
                    if (err) return next(err);

                    var to = '<' + data.email + '>';

                    var subject = result.subject + ' № заказа ' + data.order_num;

                    var createMail = new CreateMail(to, subject, template);

                    createMail.send(next);
                });
            })
        })

        var adminTpl = conf.rootDir + '/templates/order_for_admin.jade';

        thenJade.renderFile(adminTpl, property , function (err, html) {
            if (err) return next(err);

            var to = '<' + conf.mail.admin_mail + '>';

            var subject = 'Поступил новый заказ № ' + data.order_num;

            var createMail = new CreateMail(to, subject, html);

            createMail.send(next);
        })
    },
    sendStatus: function (order, next) {
        var path = conf.rootDir + '/templates/status.jade';

        templateAPI.get({slug: 'status'}, function (err, result) {
            if (err) return next(err);

            if(!result) return;

            var prop = {
                status: order.status,
                order_num: order.order_num
            };
            var fn = thenJade.compile(result.body, prop);

            fn(prop, function (err, html) {
                thenJade.renderFile(path, {body: html} , function (err, template) {
                    if (err) return next(err);

                    var to = '<' + order.email + '>';

                    var subject = result.subject + ' № заказа ' + order.order_num;

                    var createMail = new CreateMail(to, subject, template);

                    createMail.send(next);
                });
            })
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