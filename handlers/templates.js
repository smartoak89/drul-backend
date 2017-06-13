var templatesAPI = require('../api/templates');
var trans = require('../libs/support').transliterator;

exports.create = function (req, res, next) {
    validator(sanitize(req.body), function (err, data) {
        if (err) return res.status(400).json({message: err});

        templatesAPI.create(data, next, function(result) {
            res.json(result);
        })

    });
};

exports.list = function (req, res, next) {
    templatesAPI.list(next, function (results) {
        res.json(results);
    })
};

exports.update = function (req, res, next) {
    var templateId = req.params.id;

    validator(sanitize(req.body), function (err, data) {
        if (err) return res.status(400).json({message: err});

        templatesAPI.update(templateId, data, next, function(err, result) {
            if (err) return res.status(404).json({message: err});
            res.json(result);
        })

    });
};

exports.remove = function (req, res, next) {
    var templateId = req.params.id;

    templatesAPI.remove(templateId, next, function (err, results) {
        if (err) return res.status(404).json({message: err});
        res.json({message: results});
    })
};

function sanitize(data) {
    return {
        subject: data.subject,
        name: data.name,
        body: data.body
    }
}

function validator(data, callback) {
    if (!data.name)  return callback('Укажите название шаблона');
    data.slug = trans(data.name).replace(/\s/ig, '-');
    if (!data.subject)  return callback('Укажите тему шаблона');
    if (typeof data.subject !== 'string')  return callback('Тема должна быть типа \'string\'');
    if (!data.body)  return callback('Укажите текст шаблона');
    if (typeof data.body !== 'string')  return callback('Текст шаблона должен быть типа \'string\'');
    callback(null, data);
}