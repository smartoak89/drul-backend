var db = require('../libs/datastore')('mail');
var conf = require('../conf');
var mailer = require('nodemailer');
var sendpulse = require('../api/sendpulse');

var API_USER_ID="afca849f3853f45fffeae7b9240fa568"
var API_SECRET="60cddbfe044767c3635249b7704d4bf6"

var TOKEN_STORAGE="/tmp/tokens"

sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE);

var answerGetter = function answerGetter(data){
    console.log(data);
}

//
module.exports = {

    sendMail: function () {
        var email = {
            "html" : "<h1>Example text</h1>",
            "text" : "Example text",
            "subject" : "Example subject",
            "from" : {
                "name" : "Юра Виноградов",
                "email" : "smartoak89@gmail.com"
            },
            "to" : [
                {
                    "name" : "Юра",
                    "email" : "yura@koderra.com"
                }
            ]
        };

        var transport = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: "smartoak89@gmail.com",
                pass: "am1499be"
            }
        });

        var mailOptions = email;

        transport.sendMail(mailOptions, function (err, result) {
            // if (err) return callback(err);
            // callback(result);
            if(err) console.log('error', err);
            console.log('result', result);
        });
    }
};