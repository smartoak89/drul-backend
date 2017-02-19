var adminHandler = require('../handlers/templates/admin-templates');

function getRouter(router) {
    router.get('/', adminHandler.index);
    router.get('/categories', adminHandler.categories);
    router.get('/products', adminHandler.products);
    router.get('/users', adminHandler.users);
    router.get('/request', adminHandler.request);
    router.get('/stocks', adminHandler.stocks);
    router.get('/delivery', adminHandler.delivery);
    router.get('/reviews', adminHandler.reviews);

    return router;
}

module.exports = function (router) {
    return getRouter(router)
};
//
// module.exports = function (app) {
//     app.get('/admin', adminHandler.main);
//     app.get('/admin/tovs', adminHandler.tovs);
//     app.get('/admin/categ', adminHandler.categ);
//     app.get('/admin/reqs', adminHandler.reqs);
//     app.get('/admin/stocks', adminHandler.stocks);
//     app.get('/admin/curr', adminHandler.curr);
//     app.get('/admin/deliv', adminHandler.deliv);
//     app.get('/admin/com', adminHandler.com);
//     app.get('/admin/users', adminHandler.users);
// };
