var categoryAPI = require('../api/category');
var Promise = require('bluebird');
var resErr = require('../libs/support').resErr;
var trans = require('../libs/support').transliterator;

exports.create = function (req, res, next) {
    var categ = validator(req.body, res);
    categ.path.push({
            name: categ.name,
            slug: categ.slug
        });
    console.log('categ', categ);
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
        categ.path = result.path;
        categ.path.push({
            name: categ.name,
            slug: categ.slug
        });

        categoryAPI.create(categ, res, next, function (err, result) {
            if (err) return next(err);

            res.json(result);
        })
    });
};
exports.list = function (req, res, next) {
    categoryAPI.list({}, function (err, result) {
        if (err) return next(err);
        buildTree(result, res);
    });
};
exports.update = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.status(400).json({message: err});

        categoryAPI.update(req.params.id, value, function (err, result) {
            if (err) return next(err);
            res.json({message: 'Подкатегория добавлени'});
        });
    });

};
exports.add = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.status(400).json({message: err});
        categoryAPI.add(req.params.id, value, function (err) {
            if (err) return next(err);
            res.json({message: 'Категория добавлени'});
        })
    });
};
exports.getFilter = function (req,res,next) {
    var categName = req.params.name;
    var productAPI = require('../api/product');

    productAPI.getProductFilter(categName, function (err, filter) {
        if(err) return next(err);
        res.json(filter);
    });

    // productAPI.findAll({category: categName}, function (err, products) {
    //     if (err) return next(err);
    //     res.json(products);
    // })
};
exports.remove = function (req, res, next) {
    categoryAPI.remove(req.params.id, res, function(err, result) {
        if (err) return next(err);

        if(!result) return res.json(error(404, 'Категория не найдена'));
        res.json(result);
    })
};

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

    return sanitize(data);
}

function sanitize (data) {
    data.slug = trans(data.name).replace(/\s/ig, '-');

    return {
        name: data.name,
        slug: data.slug,
        path: []
    }
};