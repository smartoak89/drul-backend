var Promise = require("bluebird");
var request = require('request');
var _ = require('lodash');
var memstor = require('./memstor');

exports.converter = function (curr, product, next, callback) {

    courses(curr, next, function (amount) {
        product.price = (product.price / amount).toFixed(2);
        callback(product);
    });
};

function courses (currency, next, callback) {
    currency = currency.toUpperCase();

    memstor.get('currency-' + currency, next, function (cours) {
        // if (cours) return callback(Number(cours));

        courseAPI().then(function (res) {

            var ccy = _.find(res, {ccy: currency});

            if (ccy) {
                memstor.set('currency-' + currency, ccy.sale);
                return callback(Number(ccy.sale));
            }
        })
    })
}

function expire () {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    var nextday = new Date((tomorrow.getMonth()+1)+','+tomorrow.getDate()+','+tomorrow.getFullYear()+',10:00:00');
    return nextday;
}

function courseAPI () {

    return new Promise(function (resolve, reject) {
        request.get({
            url: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
        }, function (err, response, body) {
            if (err) return reject(err);

            try {
                resolve(JSON.parse(body))
            } catch (ex) {
                reject(new Error('response from api.privatbank is empty'));
            }

        });
    })
}