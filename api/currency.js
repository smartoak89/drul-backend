var Promise = require("bluebird");
var request = require('request');
var _ = require('lodash');
var memstor = require('./memstor');

exports.converter = function (curr, product, next, callback) {
    courses(curr, next, function (amount) {
        console.log('amount', amount);
        product.price = (product.price / amount).toFixed(2);
        callback(product);
    });
};

function courses (currency, next, callback) {
    currency = currency.toLowerCase();

    memstor.get('currency-' + currency, next, function (cours) {
        if (cours) {
            return callback(Number(cours));
        } else {
            courseAPI().then(function (res) {
                var ccy = _.find(res, {ccy: currency.toUpperCase()});

                if (ccy) {
                    memstor.set('currency-' + currency, ccy.sale);
                    memstor.expire('currency-' + currency, expire());
                    return callback(Number(ccy.sale));
                }
            })
        }
    })
}

function expire () {
    var now = new Date();
    var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 10);
    var diff = tomorrow - now;

    return Math.round(diff / 1000)
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