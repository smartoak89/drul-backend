var sliderAPI = require('../api/slider');

exports.add = function (req, res, next) {

    isValid(req.body, function (err, data) {
        if (err) return res.status(400).json({message: err});

        sliderAPI.add(data, function (err, slider) {
            if (err) return next(err);
            res.json(slider);
        })
    });
};
exports.list = function (req, res, next) {
    sliderAPI.list(function (err, sliders) {
        if (err) return next(err);
        res.json(sliders);
    })
};

exports.remove = function (req, res, next) {
    var id = req.params.id;

    sliderAPI.find({uuid: id}, function (err, slider) {
        if (err) return next(err);
        if (!slider) return res.status(404).json({message: 'Slide Not Found'});

        sliderAPI.remove(id, function (err, result) {
            if (err) return next(err);
            res.json(result);
        })
    })
};

exports.update = function (req, res, next) {
    var id = req.params.id;

    sliderAPI.find({uuid: id}, function (err, slider) {
        if (err) return next(err);
        if (!slider) return res.status(404).json({message: 'Slide Not Found'});

        isValid(req.body, function (err, data) {
            if (err) return res.status(400).json({message: err});

            sliderAPI.update(id, data, function (err, slider) {
                if (err) return next(err);
                res.json(slider);
            })
        });
    })
};


function isValid (b, callback) {
    var v = require('../libs/validator');

    var data = {
        link: b.link,
        header: b.header,
        description: b.description
    };

    var schema = v.joi.object().keys({
        link: v.joi.string().allow(''),
        header: v.joi.string().allow(''),
        description: v.joi.string().allow('')
    });

    v.validate(data, schema, callback);
}