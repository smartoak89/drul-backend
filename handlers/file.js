var fileAPI = require('../api/file');
var productAPI = require('../api/product');
var msg = require('../message/ru/file');
var HttpError = require('../error/index').HttpError;
var Promise = require("bluebird");
var conf = require('../conf/index');
var fs = require('fs');

exports.uploadPhoto = function (req, res, next) {
    var document = {uuid: req.params.id};
    //TODO: allow upload only type "image"
    productAPI.findOne(document, function (err, result) {
        if (err) return next(err);

        createFolder(result.uuid, function (err) {
            if (err) return next(err);
            upload(req, result.uuid, function (err) {
                if (err) return next(err);
                res.sendMsg(msg.UPLOADED);
            });
        })
    });
};

exports.delete = function (req, res, next) {
    fileAPI.remove(req.params.id, function (err, result) {
        if (err) return next(err);
        res.sendMsg(msg.DELETED_ONE);
    });
};

exports.get = function (req, res, next) {
    fileAPI.findOne({uuid: req.params.id}, function (err, result) {
        if (err) return next(err);
        if (!result) return next(new HttpError(404, 'File Not Found'));
        res.setHeader("Content-Type", result.mime);
        read(result, res, function (err) {
            if (err) return callback(err);
        })
    });
};

function read (file, res, callback) {
    var path = conf.tmp + '/' + file.parent + '/' + file.name;
    var rs = fs.createReadStream(path);
    rs.pipe(res);
}

function upload (req, productID, callback) {
    var Busboy = require('busboy');
    var busboy = new Busboy({ headers: req.headers });

    var files = [];

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var filedesc = {
            parent: productID,
            name: filename,
            mime: mimetype,
            created: Date.now(),
            size: undefined
        };

        var out = fs.createWriteStream(conf.tmp + '/' + productID + '/' + filename)
            .on('error', function (err) { return callback(err); });

        var dataLength = 0;
        file.on('data', function(chunk) {
            dataLength += chunk.length;
            out.write(chunk);
        })
            .on('end', function() {
                out.end();
                filedesc.size = dataLength;
                files.push(filedesc);
            })
            .on('error', function(err) { return callback(err) });
    });

    busboy.on('finish', function() {
        Promise.map(files, save).then(function (data) {
            callback();
        }, function(err) {
            callback(err);
        });
    });

    req.pipe(busboy);
}

var save = Promise.promisify(function (file, b, c, callback) {
    fileAPI.create(file, callback);
});

function createFolder (name, callback) {
    var folder = conf.tmp + '/' + name;
    fs.exists(folder, function (exists) {
        if (exists) return callback(null);
        fs.mkdir(folder, function (err) {
            if (err) return callback(err);
            return callback(null);
        })
    })
}