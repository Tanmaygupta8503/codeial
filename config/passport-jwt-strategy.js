const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt; // ExtractJWT is a helper function that will help us extract the JWT sent by the user
const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // this will extract the JWT from the header
    secretOrKey: 'codeial' // this is the encryption and decryption key
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    User.findById(jwtPayLoad._id, function(err, user){
        if(err){console.log('Error in finding user from JWT'); return;}

        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    });
}));

module.exports = passport;