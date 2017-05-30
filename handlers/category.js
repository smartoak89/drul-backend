var categoryAPI = require('../api/category');
var Promise = require('bluebird');
var resErr = require('../libs/support').resErr;
var trans = require('../libs/support').transliterator;
var productApi = require('../api/product');

exports.create = function (req, res, next) {
    var categ = validator(req.body, res);

    categoryAPI.create(categ, res, next, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
};

exports.createSub = function (req, res, next) {
    var criteria = {uuid: req.params.id};

    categoryAPI.get(criteria, next, function (result) {
        if (!result) return resErr(res, 404, 'Категория не найдена');

        var categ = validator(req.body, res);
        categ.parent = req.params.id;
        categ.parents = result.parents;
        categ.parents.push(req.params.id);
        categ.path.name = result.path.name.concat(categ.path.name);
        categ.path.slug = result.path.slug.concat(categ.path.slug);

        categoryAPI.create(categ, res, next, function (err, result) {
            if (err) return next(err);

            res.json(result);
        })
    });
};

exports.list = function (req, res, next) {
    categoryAPI.list({}, next, function (result) {
        buildTree(result, res);
    });
};

exports.update = function (req, res, next) {
    var criteria = {uuid: req.params.id};
    var updated = validator(req.body, res);

    categoryAPI.get(criteria, next, function(result) {
        if (!result) return res.status(404).json({message: 'Категория не найдена'});

        categoryAPI.list({parents: result.uuid}, next, function (categories) {

            if (categories.length > 0) {
                Promise.map(categories, function (item) {
                    item.path = updatePath(item, result.slug, updated);
                    productApi.updateCategoryPath({'category.id': item.uuid}, next, item.path, function () {
                        categoryAPI.update(item.uuid, item, next, function() {});
                    });
                }).then(function () {
                    save();

                });
            }else {
                save();
            }


            function save() {
                productApi.updateCategoryPath({'category.id': result.uuid}, next, updatePath(result, result.slug, updated), function () {
                    result.path = updatePath(result, result.slug, updated);
                    result.name = updated.name;
                    result.slug = updated.slug;

                    categoryAPI.update(result.uuid, result, next, function(upCateg) {
                        res.json(upCateg);
                    });
                })
            }

        });
    })

};

// exports.add = function (req, res, next) {
//     isValid(req, function (err, value) {
//         if (err) return res.status(400).json({message: err});
//         categoryAPI.add(req.params.id, value, function (err) {
//             if (err) return next(err);
//             res.json({message: 'Категория добавлени'});
//         })
//     });
// };

exports.getFilter = function (req,res,next) {
    var categName = req.params.name;
    var productAPI = require('../api/product');

    productAPI.getProductFilter(categName, function (err, filter) {
        if(err) return next(err);
        res.json(filter);
    });
};

exports.remove = function (req, res, next) {
    categoryAPI.remove(req.params.id, res, function(err, result) {
        if (err) return next(err);

        if(!result) return res.json(error(404, 'Категория не найдена'));
        res.json(result);
    })
};

function updatePath(item, slug, _new) {
    var ind = item.path.slug.indexOf(slug);

    return {
        name: item.path.name.map(search('name')),
        slug: item.path.slug.map(search('slug'))
    };

    function search(opt) {
        return function(c, i) {
            if (i == ind) return _new.path[opt][0];
            return c;
        }
    }
}

function buildTree (categs, res) {
    var nodes = categs;
    var map = {},
        node,
        roots = [];

    if (nodes.length > 0) {
        for (var i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            node.children = [];
            map[node.uuid] = i;
            if (node.parent !== "root") {
                nodes[map[node.parent]].children.push(node);
            } else {
                roots.push(node);
            }
        }
    }

    res.json(roots);

}

function validator (data, res) {
    if (!data.name) return resErr(res, 400, 'Введите название категории');
    if (typeof data.name !== 'string') return resErr(res, 400, 'Название должно быть строкой');

    return sanitize(data);
}

function sanitize (data) {
    data.slug = trans(data.name).replace(/\s/ig, '-');
    return {
        name: data.name,
        slug: data.slug,
        path: {
            name: [data.name],
            slug: [data.slug]
        }
    }
}