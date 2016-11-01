exports.admin = require('./admin');

module.exports = {
    user: function (user) {
        return {
            uuid: user.uuid,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            created: user.created
        }
    }
};