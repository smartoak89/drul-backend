var commonHandler = require('../handlers/common');

function getRouter(router) {
    router.get('/', commonHandler.app.get);

    // router.get('/filter', commonHandler.index.filter);
    //
    // router.post('/filter', commonHandler.index.search);
    //
    // router.get('/auth', commonHandler.auth.get);
    //
    // router.post('/auth', require('../middleware/auth'), commonHandler.auth.post);
    //
    // router.post('/currency', commonHandler.currency.post);

    return router;
}

module.exports = function (router) {
    return getRouter(router)
};

// var commonAPI = require('../handlers/common');
// var userAPI = require('../handlers/api/user');
// var category = require('../handlers/api/category');
//
// module.exports = function (app) {
//     app.get('/', commonAPI.get);
//
//     // app.post('/user/register', userAPI.register);
//     // app.post('/auth', require('../middleware/auth'), function(req, res, next) {
//     //     res.end('zvezda')
//     // }, userAPI.auth);
// };