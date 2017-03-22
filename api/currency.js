var Promise = require("bluebird");
var request = require('request');
var _ = require('lodash');
var memstor = require('./memstor');

exports.converter = function (curr, product, next, callback) {

    courses(curr, next, function (amount) {
        product.price = (product.price / amount).toFixed(2);
        callback(product);
    });


    // getCurrentCourse().then(function(course) {
    //
    //     // var curr = currency.toUpperCase();
    //     // if (curr == 'UAH') return callback(null, data);
    //     //
    //     // var currentPrice;
    //     // var c = _.find(course, {ccy: curr});
    //     // c ? currentPrice = c.sale : callback(null, data);
    //     //
    //     // _.each(data, function (i) {
    //     //     if (i.old_price) {
    //     //         var oldPrice =  i.old_price / currentPrice;
    //     //         i.old_price = oldPrice.toFixed(2);
    //     //     }
    //         var price = i.price / currentPrice;
    //         i.price = price.toFixed(2);
    //     // });
    //     //
    //     // callback(null, data);
    // }, function(err) {
    //     // callback(err);
    // });
};

function courses (currency, next, callback) {
    currency = currency.toUpperCase();

    memstor.get('currency-' + currency, next, function (cours) {
        if (cours) return callback(Number(cours));

        courseAPI().then(function (res) {

            var ccy = _.find(res, {ccy: currency});

            if (ccy) {
                memstor.set('currency-' + currency, ccy.sale);
                return callback(Number(ccy.sale));
            }

            next('Currency not found');
        })
    })
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