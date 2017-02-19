exports.showUserDetail = function (user, callback) {
    console.log('showDetail', user)
    var data = {
        uuid: user.uuid,
        email: user.email,
        created: user.created
    };
    callback(data)
};