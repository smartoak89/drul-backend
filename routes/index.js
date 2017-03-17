var categoryHandler = require('../handlers/category');
var userHandler = require('../handlers/user');
var productHandler = require('../handlers/product');
var fileHandler = require('../handlers/file');
var curmonHandler = require('../handlers/curmon');
var stocksHandler = require('../handlers/stocks');
var deferredHandler = require('../handlers/deferred');
var cartHandler = require('../handlers/cart');
var combinationHandler = require('../handlers/combination');
var orderHandler = require('../handlers/order');
var reviewsHandler = require('../handlers/reviews');
var sliderHandler = require('../handlers/slider');
var mailHandler = require('../handlers/mail');
var isAuth = require('../middleware/is_auth');
var checkAdmin = require('../middleware/check_admin');

module.exports = function (app, express) {
    // app.use('/', require('./api')(express.Router()));

    //--Category
    app.get('/categories', categoryHandler.list);
    app.post('/category', checkAdmin, categoryHandler.create);
    app.put('/category/:id', checkAdmin, categoryHandler.update);
    app.post('/category/:id', checkAdmin, categoryHandler.add);
    app.delete('/category/:id', checkAdmin, categoryHandler.remove);
    app.delete('/category/:id/:index', checkAdmin, categoryHandler.remove);
    app.get('/category/:name/filter', categoryHandler.getFilter);

    //--User
    app.post('/user/register', userHandler.register);
    app.get('/users', checkAdmin, userHandler.list);
    app.put('/user/:id', userHandler.update);
    //TODO: put user;
    app.delete('/user/:id', checkAdmin, userHandler.remove);
    app.get('/user/:id', checkAdmin, userHandler.find);
    app.post('/user/auth', userHandler.auth);
    app.get('/user', isAuth, userHandler.getAuthUser);

    //--Product
    app.post('/product', checkAdmin, productHandler.create);
    app.get('/products', productHandler.list);
    app.get('/product/:id', productHandler.get);
    app.get('/products/category/:name', productHandler.listFromCurrentCateg);
    app.get('/product/:id/gallery', productHandler.gallery);
    app.put('/product/:id', checkAdmin, productHandler.update);
    app.delete('/product/:id', checkAdmin, productHandler.remove);

    //--Filter
    app.get('/filter/:category', productHandler.getProductFilter);

    //--File
    app.post('/file/:context/:id', checkAdmin, fileHandler.upload);
    // app.post('/file/:id', fileHandler.upload);
    app.get('/file/:id', fileHandler.get);
    app.get('/files/:id', fileHandler.getFiles);
    app.delete('/file/:id', checkAdmin, fileHandler.delete);
    app.put('/file/:id', checkAdmin, fileHandler.updatePhoto);

    // Currency monitor
    app.post('/curmon', curmonHandler.createEdit);
    app.get('/curmon', curmonHandler.get);

    //--Stocks
    app.post('/stocks', checkAdmin, stocksHandler.create);
    app.get('/stocks', stocksHandler.list);
    app.delete('/stocks/:id', checkAdmin, stocksHandler.remove);

    //--Deferred
    app.put('/deferred/:product', isAuth, deferredHandler.add);
    app.delete('/deferred/:product', isAuth, deferredHandler.delete);
    app.get('/deferred', isAuth, deferredHandler.list);

    // Cart
    app.put('/cart/:product', isAuth, cartHandler.add);
    app.get('/cart', isAuth, cartHandler.list);
    app.delete('/cart/:product', isAuth, cartHandler.delete);

    // Combinations
    app.post('/combination', checkAdmin, combinationHandler.create);
    app.get('/combinations', combinationHandler.list);
    app.put('/combination/:id', checkAdmin, combinationHandler.update);
    app.delete('/combination/:id', checkAdmin, combinationHandler.delete);

    //Orders
    app.post('/order', isAuth, orderHandler.add);
    app.post('/order/now', isAuth, orderHandler.buyNow);
    app.get('/order/order', isAuth, orderHandler.add);
    app.get('/orders', isAuth, orderHandler.UserOrders);
    app.get('/orders/all', checkAdmin, orderHandler.allUsersOrders);
    app.get('/order/:orderId', orderHandler.getOneOrder);
    app.put('/order/:orderId', orderHandler.update);
    app.delete('/order/:orderId', checkAdmin, orderHandler.remove);
    app.delete('/order/:orderId/:productIndex', checkAdmin, orderHandler.removeProductFromOrder);

    //Reviews
    app.post('/reviews/:productId', isAuth, reviewsHandler.add);
    app.get('/reviews/:productId', reviewsHandler.list);
    app.get('/reviews', checkAdmin, reviewsHandler.listUnpublished);
    app.put('/reviews/:reviewId', checkAdmin, reviewsHandler.update);
    app.delete('/reviews/:reviewId', checkAdmin, reviewsHandler.remove);

    //Slider
    app.post('/slider', checkAdmin, sliderHandler.add);
    app.get('/sliders', sliderHandler.list);
    app.put('/slider/:id', checkAdmin, sliderHandler.update);
    app.delete('/slider/:id', checkAdmin, sliderHandler.remove);

    //Mail
    // app.post('/mail', mailHandler.add);
    // app.post('/mail/:userId', mailHandler.sendMailToUser);
    app.get('/mail/mail', mailHandler.send);
};