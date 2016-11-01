var categoryHandler = require('../handlers/category');
var userHandler = require('../handlers/user');
var productHandler = require('../handlers/product');
var fileHandler = require('../handlers/file');

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

    //--File
    router.post('/file/:id', fileHandler.uploadPhoto);
    // router.get('/files/:id', fileHandler.list);
    router.get('/file/:id', fileHandler.get);
    router.delete('/file/:id', fileHandler.delete);

    //--Deferred
    var deferredHandler = require('../handlers/deferred');

    router.post('/deferred/:id', deferredHandler.add);
    router.get('/deferred/:id', deferredHandler.getList);
    router.delete('/deferred/:id', deferredHandler.delete);

    // Currency monitor
    var curmonHandler = require('../handlers/curmon');
    router.post('/curmon', curmonHandler.createEdit);
    router.get('/curmon', curmonHandler.get);

    return router;
}

module.exports = function (router) {
    return getRouter(router)
};