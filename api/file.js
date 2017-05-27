var db = require('../libs/datastore')('file');
var conf = require('../conf');
var fs = require('fs');

module.exports = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    findAll: function (patern, callback) {
        db.findAll(patern, callback);
    },
    remove: function (id, callback) {
        db.findOne({uuid: id}, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(404);
            removeFileFromDisk(result, function (err) {
                if (err) return callback(err);
                db.remove(id, callback);
            });
        });
    },
    findOne: function (data, callback) {
        db.findOne (data, callback);
    },
    update: function (id , data, callback) {

        db.update(id, data, callback);
    }
};

function removeFileFromDisk (filedesc, callback) {
    console.log('filedesc', filedesc);
    var context = filedesc.context;
    var folder = filedesc.parent;
    var name = filedesc.name;
    var path = conf.tmp + '/' + context + '/' + folder + '/' + name;
    if (context == 'music') path = conf.tmp + '/' + context + '/' + name;
    console.log(path);
    fs.unlink(path, function (err) {
        if (err) return callback(err);
        callback();
    })
}