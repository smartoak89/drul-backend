var userAPI = require('../../api/user');

exports.index = function (req, res, next) {
    res.render('admin/admin');
};

exports.categories = function (req, res, next) {
    var categoryAPI = require('../../api/category');
    categoryAPI.list(function (err, result) {
        if (err) return next(err);
        var list = result.map(function (i) {
            return {
                uuid: i.uuid,
                name: i.name,
                link: i.link,
                article: i.article,
                subcat: i.subcat
            }
        });
        res.render('admin/categ', {categories: list});
    });
};
exports.products = function (req, res, next) {
    res.render('admin/products');
};

exports.users = function (req, res, next) {
    res.render('admin/users');
};

exports.request = function (req, res, next) {
    res.render('admin/reqs');
};
exports.stocks = function (req, res, next) {
    res.render('admin/stocks');
};
exports.delivery = function (req, res, next) {
    res.render('admin/deliv');
};
exports.reviews = function (req, res, next) {
    res.render('admin/com');
};
exports.curr = function (req, res, next) {
    res.render('admin/curr');
};