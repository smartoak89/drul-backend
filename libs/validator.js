module.exports = {
    joi: require('joi'),
    validate: function (data, schema, callback) {
        this.joi.validate(data, schema, function (err, value) {
            if (err) return callback(err.details[0].message)
            callback(null, value);
        });
    }
};


