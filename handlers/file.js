var fileAPI = require('../api/file');
var productAPI = require('../api/product');
var sliderAPI = require('../api/slider');
var msg = require('../message/ru/file');
var HttpError = require('../error/index').HttpError;
var error = require('../error/index').ressError;
var Promise = require("bluebird");
var conf = require('../conf/index');
var fs = require('fs');
var log = require('../libs/logger')(module);

exports.upload = function (req, res, next) {

    var document = {uuid: req.params.id};
    var context = req.params.context;
    //TODO: allow upload only type "image"
    if (req.headers['content-length'] === '0') return res.status(400).json({message: "Missing Files!"});

    switch (context){
        case 'product' :
            productAPI.findOne(document, function (err, result) {
                if (err) return next(err);
                if (!result) return res.status(404).json({message: 'Product Not Found'});
                var path = conf.product_images + '/' + result.uuid;

                createFolder(path, function (err) {
                    if (err) return next(err);
                    upload({req: req, id: result.uuid, path: path}, function (err, result) {
                        if (err) return next(err);
                        res.json(result);
                    });
                })
            });
            break;

        case 'slider' :
            sliderAPI.find(document, function (err, result) {
                if (err) return next(err);
                if (!result) return res.status(404).json({message: 'Slide Not Found'});
                var path = conf.sliders_images + '/' + result.uuid;
                createFolder(path, function (err) {
                    if (err) return next(err);
                    upload({req: req, id: result.uuid, path: path}, function (err, result) {
                        if (err) return next(err);
                        res.json(result);
                    });
                })
            });
            break;

        case 'music' :
            var path = conf.music;
            upload({req: req, id: req.params.id, path: path}, function (err, result) {
                if (err) return next(err);
                res.json(result);
            });
            break;


    }
};

exports.delete = function (req, res, next) {
    fileAPI.remove(req.params.id, function (err, result) {
        if (err) return next(err);
        res.json(result);
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

exports.getFiles = function (req, res, next) {
    var criteria = {};
    criteria['sort'] = {created: -1};
    criteria['parent'] = req.params.id;
    if(req.query) {
        for(var key in req.query) {
            criteria[key] = req.query[key];
        }
    }

    fileAPI.findAll(criteria, function (err, files) {
        if (err) return next(err);
        res.json(files);
    });
    // });

};

exports.updatePhoto = function (req, res, next) {
    var id = req.params.id;

    fileAPI.findOne({uuid: id}, function (err, file) {
        if (err) return next(err);
        if (!file) return res.json(error(404, 'File Not Found'));
        var parent = file.parent;

        fileAPI.findOne({parent: parent, type: 'main'}, function (err, result) {
            if (err) return next(err);

            result.type = 'gallery';

            fileAPI.update(result.uuid, result, function (err, gallFIle) {
                if (err) return next(err);

                file.type = 'main';
                fileAPI.update(file.uuid, file, function (err, mainPhoto) {
                    if (err) return next(err);
                    res.json(mainPhoto);
                })
            })
        })
    });

};

function read (file, res, callback) {
    var path;
    switch (file.context) {
        case 'product' :
            path = conf.product_images + '/' + file.parent + '/' + file.name;
            break;
        case 'slider' :
            path = conf.sliders_images + '/' + file.parent + '/' + file.name;
            break;
        case 'music' :
            path = conf.music + '/' + file.name;
            break;
        default :
            path = '';
            break;
    }
    var rs = fs.createReadStream(path);
    rs.pipe(res);
}

function upload (params, callback) {
    var Busboy = require('busboy');
    var busboy = new Busboy({ headers: params.req.headers });

    var files = [];

    busboy.on('file', function(fieldname, file, filename, encoding, mime) {
        var path = params.path + '/' + filename;
        // if (params.req.params.context == 'music') path = params.path;

        exists(path, function (result) {
            if (result == 'yes') {
                console.log('exists');
                filename = Date.now() + '.' + mime.split('/').pop();
            }

            var filedesc = {
                context: params.req.params.context,
                type: fieldname,
                parent: params.id,
                name: filename,
                mime: mime,
                created: Date.now(),
                size: undefined
            };

            var out = fs.createWriteStream(params.path + '/' + filename)
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
    });

    busboy.on('finish', function() {
        Promise.map(files, save).then(function (data) {
            callback(null, data);
        }, function(err) {
            callback(err);
        });
    });

    params.req.pipe(busboy);
}

var save = Promise.promisify(function (file, b, c, callback) {
    // if (file.type == 'main') {
    //     fileAPI.findOne({parent: file.parent, type: 'main'}, function (err, resfile) {
    //         if (err) return callback(err);
    //         if (resfile) {
    //             resfile.type = 'gallery';
    //
    //             fileAPI.update(resfile.uuid, resfile, function (err) {
    //                 if (err) return callback(err);
    //                 fileAPI.create(file, callback);
    //             });
    //         } else {
    //             return fileAPI.create(file, callback);
    //         }
    //     });
    // } else {

    fileAPI.create(file, callback);

    // }
});

function createFolder (path, callback) {
    exists(path, function (res) {
        if (res == 'yes') return callback(null);
        fs.mkdir(path, function (err) {
            if (err) return callback(err);
            return callback(null);
        })
    });
}

function exists (path, callback) {
    fs.exists(path, function (exists) {
        if (exists) return callback('yes');
        return callback('no');
    })
}













//
//
// var fileAPI = require('../api/file');
// var productAPI = require('../api/product');
// var msg = require('../message/ru/file');
// var HttpError = require('../error/index').HttpError;
// var error = require('../error/index').ressError;
// var Promise = require("bluebird");
// var conf = require('../conf/index');
// var fs = require('fs');
// var log = require('../libs/logger')(module);
//
// // exports.uploadPhoto = function (req, res, next) {
// //     var document = {uuid: req.params.id};
// //     //TODO: allow upload only type "image"
// //     productAPI.findOne(document, function (err, result) {
// //         if (err) return next(err);
// //
// //         createFolder(result.uuid, function (err) {
// //             if (err) return next(err);
// //             upload(req, result.uuid, function (err) {
// //                 if (err) return next(err);
// //                 res.sendMsg(msg.UPLOADED);
// //             });
// //         })
// //     });
// // };
// exports.upload = function (req, res, next) {
//     var document = {uuid: req.params.id};
//     //TODO: allow upload only type "image"
//     productAPI.findOne(document, function (err, result) {
//         if (err) return next(err);
//         if (!result) return res.status(404).json({error_message: 'Product Not Found'});
//         createFolder(result.uuid, function (err) {
//             if (err) return next(err);
//             upload(req, result.uuid, function (err, result) {
//                 if (err) return next(err);
//                 res.json(result);
//             });
//         })
//     });
// };
//
// exports.delete = function (req, res, next) {
//     fileAPI.remove(req.params.id, function (err, result) {
//         if (err) return next(err);
//         res.json(result);
//     });
// };
//
// exports.get = function (req, res, next) {
//     fileAPI.findOne({uuid: req.params.id}, function (err, result) {
//         if (err) return next(err);
//         if (!result) return next(new HttpError(404, 'File Not Found'));
//         res.setHeader("Content-Type", result.mime);
//         read(result, res, function (err) {
//             if (err) return callback(err);
//         })
//     });
// };
//
// exports.getFiles = function (req, res, next) {
//     var id = req.params.id;
//     var criteria = req.query || {};
//     criteria['parent'] = id;
//
//     productAPI.findOne({uuid: id}, function (err, product) {
//         if (err) return next(err);
//         if (!product) return res.json(error(404, 'Product Not Found'));
//
//         fileAPI.findAll(criteria, function (err, files) {
//             if (err) return next(err);
//             if (!files) return res.json(error(404, 'Files Not Found'));
//             res.json(files);
//         })
//     });
//
// };
//
// exports.updatePhoto = function (req, res, next) {
//     var id = req.params.id;
//     fileAPI.findOne({uuid: id}, function (err, file) {
//         if (err) return next(err);
//         if (!file) return res.json(error(404, 'File Not Found'));
//         var parent = file.parent;
//
//         fileAPI.findOne({parent: parent, type: 'main'}, function (err, result) {
//             if (err) return next(err);
//
//             result.type = 'gallery';
//
//             fileAPI.update(result.uuid, result, function (err, gallFIle) {
//                 if (err) return next(err);
//
//                 file.type = 'main';
//                 fileAPI.update(file.uuid, file, function (err, mainPhoto) {
//                     if (err) return next(err);
//                     res.json(mainPhoto);
//                 })
//             })
//         })
//     });
//     // productAPI.findOne({uuid: id}, function (err, product) {
//     //     if (err) return next(err);
//     //     if (!product) return res.json(error(404, 'Product Not Found'));
//     //
//     //     fileAPI.findAll(criteria, function (err, files) {
//     //         if (err) return next(err);
//     //         if (!files) return res.json(error(404, 'Files Not Found'));
//     //         res.json(files);
//     //     })
//     // });
//
// };
//
// function read (file, res, callback) {
//     var path = conf.tmp + '/' + file.parent + '/' + file.name;
//     var rs = fs.createReadStream(path);
//     rs.pipe(res);
// }
//
// function upload (req, productID, callback) {
//     var Busboy = require('busboy');
//     var busboy = new Busboy({ headers: req.headers });
//
//     var files = [];
//
//     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//
//         var filedesc = {
//             type: fieldname,
//             parent: productID,
//             name: filename,
//             mime: mimetype,
//             created: Date.now(),
//             size: undefined
//         };
//
//         console.log('fieldname', fieldname)
//
//         var out = fs.createWriteStream(conf.tmp + '/' + productID + '/' + filename)
//             .on('error', function (err) { return callback(err); });
//
//         var dataLength = 0;
//         file.on('data', function(chunk) {
//             dataLength += chunk.length;
//             out.write(chunk);
//         })
//             .on('end', function() {
//                 out.end();
//                 filedesc.size = dataLength;
//                 files.push(filedesc);
//             })
//             .on('error', function(err) { return callback(err) });
//     });
//
//     busboy.on('finish', function() {
//         Promise.map(files, save).then(function (data) {
//             callback();
//         }, function(err) {
//             callback(err);
//         });
//     });
//
//     req.pipe(busboy);
// }
//
// function createFolder (name, callback) {
//     var folder = conf.tmp + '/' + name;
//     fs.exists(folder, function (exists) {
//         if (exists) return callback(null);
//         fs.mkdir(folder, function (err) {
//             if (err) return callback(err);
//             return callback(null);
//         })
//     })
// }
//
// var save = Promise.promisify(function (file, b, c, callback) {
//     log.info('saveFile');
//     if (file.type == 'main') {
//         fileAPI.findOne({parent: file.parent, type: 'main'}, function (err, resfile) {
//             log.info('findeOneFunc');
//             if (err) return callback(err);
//             if (resfile) {
//                 resfile.type = 'gallery';
//                 console.log('resFile', resfile);
//                 fileAPI.update(resfile.uuid, resfile, function (err) {
//                     if (err) return callback(err);
//                     fileAPI.create(file, callback);
//                 });
//             } else {
//                 return fileAPI.create(file, callback);
//             }
//         });
//     } else {
//         fileAPI.create(file, callback);
//     }
// });
