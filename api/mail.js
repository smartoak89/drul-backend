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
            console.log(html)
            var to = '<' + email + '>';

            var subject = 'Регистрация на сайте www.today.net.ua';

            var createMail = new CreateMail(to, subject, html);

            createMail.send(next);
        })


    }
    // firstOrder: function (order, callback) {
    //     var transport = createTransport();
    //     var to = '<' + order.email + '>';
    //     var subject = 'Добро пожаловать на сайт супер модной одежны Tooday';
    //     var html = template.firstOrder(order);
    //
    //     var createMail = new CreateMail(transport, to, subject, html);
    //
    //     createMail.send(callback);
    // }
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