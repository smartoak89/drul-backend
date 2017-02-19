var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , userAPI = require('../api/user');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        userAPI.findOne({ email: email }, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Incorrect email or password' });
            if (!user.checkPassword(password)) return done(null, false, { message: 'Incorrect email or password'});
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log('Got User in pasport => ', user);
    done(null, user.uuid);
});

passport.deserializeUser(function(id, done) {
    userAPI.find(id, function(err, user) {
        done(err, user);
    });
});

module.exports = passport;