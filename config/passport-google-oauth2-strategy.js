const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');
// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "635738109368-u66t1l2kofeo19lai7o05ge0nma5f782.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
function(accessToken, refreshToken, profile, done){
    // find a user
    User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        if(err){console.log('Error in google strategy-passport', err); return;}
        console.log(profile);
        if(user){
            // if found, set this user as req.user
            return done(null, user);
        }else{
            // if not found, create the user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user){
                if(err){console.log('Error in creating user google strategy-passport', err); return;}
                return done(null, user);
            });
        }
    });
}
));

module.exports = passport;