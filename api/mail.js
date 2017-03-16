var db = require('../libs/datastore')('mail');
var conf = require('../conf');
var mailer = require('nodemailer');
var template = require('../templates');
var path = require('path');

module.exports = {

    // sendMail: function (callback) {
    //
    //     var transport = createTransport();
    //     var to = 'Yura <yura@koderra.com>';
    //     var subject = 'Добро пожаловать на сайт супер модной одежны Tooday';
    //     var html = '<p><center>Привет тебе!!!</center></p>';
    //
    //     var createMail = new CreateMail(transport, to, subject, html);
    //
    //     createMail.send(callback);
    //
    // },
    // welcome: function (email, callback) {
    //
    //     var transport = createTransport();
    //     var to = '<' + email + '>';
    //     var subject = 'Добро пожаловать на сайт супер модной одежны Tooday';
    //     var html = template.welcome;
    //
    //     var createMail = new CreateMail(transport, to, subject, html);
    //
    //     createMail.send(callback);
    // },
    welcome: function (email, callback) {

        var thenJade = require('then-jade');

        var tpl = conf.rootDir + '/templates/register.jade';
        var options = {};


        thenJade.renderFile(tpl, {} , function (err, html) {
            if (err) return console.log('error', err);

            var to = '<' + email + '>';
            var subject = 'Добро пожаловать на сайт супер модной одежны Tooday';

            var createMail = new CreateMail(to, subject, html);

            createMail.send(callback);
        })


    },
    firstOrder: function (order, callback) {
        var transport = createTransport();
        var to = '<' + order.email + '>';
        var subject = 'Добро пожаловать на сайт супер модной одежны Tooday';
        var html = template.firstOrder(order);

        var createMail = new CreateMail(transport, to, subject, html);

        createMail.send(callback);
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

    send: function (callback) {
        var self = this;

        this.transport.sendMail(this.message, function (err, info) {
            if (err) return callback(err);
            self.close();
            callback(null, info);
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