var categoryHandler = require('../handlers/category');
var userHandler = require('../handlers/user');
var productHandler = require('../handlers/product');
var fileHandler = require('../handlers/file');
var filterHandler = require('../handlers/filter');

function getRouter(router) {
    //--Category
    router.get('/categories', categoryHandler.list);
    router.post('/category', categoryHandler.create);
    router.put('/category/:id', categoryHandler.update);
    router.post('/category/:id', categoryHandler.add);
    router.delete('/category/:id', categoryHandler.remove);
    router.delete('/category/:id/:index', categoryHandler.remove);

    //--User
    router.post('/user/register', userHandler.register);
    router.get('/users', userHandler.list);
    router.put('/user/:id', userHandler.update);
    router.delete('/user/:id', userHandler.remove);
    router.get('/user/:id', userHandler.find);
    router.post('/user/auth', userHandler.auth);

    //--Product
    router.post('/product', productHandler.create);
    router.get('/products', productHandler.list);
    router.get('/product/:id', productHandler.get);
    router.get('/product/:id/gallery', productHandler.gallery);
    router.put('/product/:id', productHandler.update);
    router.delete('/product/:id', productHandler.remove);

    //--Filter
    router.get('/filter/:category', productHandler.getProductFilter);

    //--File
    // router.post('/file/:id', fileHandler.uploadPhoto);
    router.post('/file/:id', fileHandler.upload);
    router.get('/file/:id', fileHandler.get);
    router.get('/files/:id', fileHandler.getFiles);
    router.delete('/file/:id', fileHandler.delete);
    router.put('/file/:id', fileHandler.updatePhoto);

    // Currency monitor
    var curmonHandler = require('../handlers/curmon');
    router.post('/curmon', curmonHandler.createEdit);
    router.get('/curmon', curmonHandler.get);

    //--Stocks
    var stocksHandler = require('../handlers/stocks');
    router.post('/stocks', stocksHandler.create);
    router.get('/stocks', stocksHandler.list);
    router.delete('/stocks/:id', stocksHandler.remove);

    //--Deferred
    var deferredHandler = require('../handlers/deferred');
    router.put('/deferred/:user/:product', deferredHandler.add);
    router.delete('/deferred/:user/:product', deferredHandler.delete);
    router.get('/deferred/:user', deferredHandler.list);

    // Cart
    var cartHandler = require('../handlers/cart');
    router.put('/cart/:user/:product', cartHandler.add);
    router.get('/cart/:user', cartHandler.list);
    router.delete('/cart/:user/:product', cartHandler.delete);

    // Combinations
    var combinationHandler = require('../handlers/combination');
    router.post('/combination', combinationHandler.create);
    router.get('/combinations', combinationHandler.list);
    router.put('/combination/:id', combinationHandler.update);
    router.delete('/combination/:id', combinationHandler.delete);

    // Comments
    var commentHandler = require('../handlers/comment');
    router.post('product/:id/comment', commentHandler.add);
    return router;
}

module.exports = function (router) {
    return getRouter(router)
};