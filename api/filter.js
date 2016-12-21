var db = require('../libs/datastore')('product');
var productAPI = require('./product');

module.exports = {
    get: function (category, callback) {
        var criteria = {category: category};
        productAPI.findAll(criteria, function (err, products) {
            if (err) return callback(err);
            console.log(products);
        })
    }
};
