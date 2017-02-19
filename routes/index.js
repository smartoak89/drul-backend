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

module.exports = function (app, express) {
    // app.use('/', require('./api')(express.Router()));

    //--Category
    app.get('/categories', categoryHandler.list);
    app.post('/category', categoryHandler.create);
    app.put('/category/:id', categoryHandler.update);
    app.post('/category/:id', categoryHandler.add);
    app.delete('/category/:id', categoryHandler.remove);
    app.delete('/category/:id/:index', categoryHandler.remove);
    app.get('/category/:name/filter', categoryHandler.getFilter);

    //--User
    app.post('/user/register', userHandler.register);
    app.get('/users', userHandler.list);
    app.put('/user/:id', userHandler.update);
    app.delete('/user/:id', userHandler.remove);
    app.get('/user/:id', userHandler.find);
    app.post('/user/auth', userHandler.auth);

    //--Product
    app.post('/product', productHandler.create);
    app.get('/products', productHandler.list);
    app.get('/product/:id', productHandler.get);
    app.get('/products/category/:name', productHandler.listFromCurrentCateg);
    app.get('/product/:id/gallery', productHandler.gallery);
    app.put('/product/:id', productHandler.update);
    app.delete('/product/:id', productHandler.remove);

    //--Filter
    app.get('/filter/:category', productHandler.getProductFilter);

    //--File
    app.post('/file/:context/:id', fileHandler.upload);
    // app.post('/file/:id', fileHandler.upload);
    app.get('/file/:id', fileHandler.get);
    app.get('/files/:id', fileHandler.getFiles);
    app.delete('/file/:id', fileHandler.delete);
    app.put('/file/:id', fileHandler.updatePhoto);

    // Currency monitor
    app.post('/curmon', curmonHandler.createEdit);
    app.get('/curmon', curmonHandler.get);

    //--Stocks
    app.post('/stocks', stocksHandler.create);
    app.get('/stocks', stocksHandler.list);
    app.delete('/stocks/:id', stocksHandler.remove);

    //--Deferred
    app.put('/deferred/:user/:product', deferredHandler.add);
    app.delete('/deferred/:user/:product', deferredHandler.delete);
    app.get('/deferred/:user', deferredHandler.list);

    // Cart
    app.put('/cart/:user/:product', cartHandler.add);
    app.get('/cart/:user', cartHandler.list);
    app.delete('/cart/:user/:product', cartHandler.delete);

    // Combinations
    app.post('/combination', combinationHandler.create);
    app.get('/combinations', combinationHandler.list);
    app.put('/combination/:id', combinationHandler.update);
    app.delete('/combination/:id', combinationHandler.delete);

    //Orders
    app.post('/order/:userId', orderHandler.add);
    app.get('/orders/:userId', orderHandler.allUserOrders);
    app.get('/orders', orderHandler.allListOrders);
    app.get('/order/:orderId', orderHandler.getOneOrder);
    app.put('/order/:orderId', orderHandler.update);
    app.delete('/order/:orderId', orderHandler.remove);
    app.delete('/order/:orderId/:productIndex', orderHandler.removeProductFromOrder);

    //Reviews
    app.post('/reviews/:productId/:userId', reviewsHandler.add);
    app.get('/reviews/:productId', reviewsHandler.list);
    app.get('/reviews', reviewsHandler.listUnpublished);
    app.put('/reviews/:reviewId', reviewsHandler.update);
    app.delete('/reviews/:reviewId', reviewsHandler.remove);

    //Slider
    app.post('/slider', sliderHandler.add);
    app.get('/sliders', sliderHandler.list);
    app.put('/slider/:id', sliderHandler.update);
    app.delete('/slider/:id', sliderHandler.remove);

};