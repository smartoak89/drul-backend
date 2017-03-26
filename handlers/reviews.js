var productAPI = require('../api/product');
var reviewsAPI = require('../api/reviews');
var userAPI = require('../api/user');
var orderAPI = require('../api/order');

exports.add = function (req, res, next) {
    var productID = req.params.productId;
    var user = req.user;


       productAPI.findOne({uuid: productID}, function (err, product) {
           if (err) return next(err);
           if (!product) return res.status(404).json({error_status: 404, error_message: 'Product Not Found'});
           if (!req.body.body) return res.status(400).json({error_status: 400, error_message: "Коментарий пуст"});

           orderAPI.find({owner: user.uuid, 'products.productID': productID}, function (err, order) {
               if (err) return callback(err);
               if (!order && user.permission != 'administrator') return res.status(400).json({message: 'Вы не можете оставлять отзыв к данному товару!'});

               var review = {
                   body: req.body.body,
                   product_id: productID,
                   owner_id: user.uuid,
                   owner_name: user.firstname,
                   publish: false
               };

               reviewsAPI.create(review, function (err, result) {
                   if (err) return next(err);
                   res.json(result);
               })
           });

       })

    // isValid(req, function (err, value) {
    //     log.log('gotVal %', value);
    //     if (err) return res.sendMsg(err, true, 400);
    //     productApi.create(value, function (err, product) {
    //         if (err) return next(err);
    //         res.json(product);
    //     })
    // });
};

exports.update = function (req, res, next) {
    var rewId = req.params.reviewId;

    reviewsAPI.update(rewId, req.body, function (err, updated) {
        if (err) return next(err);
        if (!updated) return res.status(404).json({message: 'Отзыв не найден'});
        res.json(req.body)
    })
};

exports.list = function (req, res, next) {
    var productID = req.params.productId;

    productAPI.findOne({uuid: productID}, function (err, product) {
        if (err) return next(err);
        if (!product) return res.status(404).json({error_status: 404, error_message: 'Product Not Found'});

        reviewsAPI.findAll({product_id: productID, publish: true}, function (err, list) {
            if (err) return next(err);
            res.json(list);
        })
    })
};

exports.allList = function (req, res, next) {
    var productID = req.params.productId;

    productAPI.findOne({uuid: productID}, function (err, product) {
        if (err) return next(err);
        if (!product) return res.status(404).json({error_status: 404, error_message: 'Product Not Found'});

        reviewsAPI.findAll({product_id: productID}, function (err, list) {
            if (err) return next(err);
            res.json(list);
        })
    })
};

exports.listUnpublished = function (req, res, next) {

    reviewsAPI.findAll({publish: false}, function (err, list) {
        if (err) return next(err);
        res.json(list);
    })
};

exports.remove = function (req, res, next) {
    var reviewID = req.params.reviewId;

    reviewsAPI.remove(reviewID, function (err, result) {
        if (err) return next(err);
        if (!result) return res.status(404).json({error_message: 'Review Not Found'});
        res.json(result);
    })
};
