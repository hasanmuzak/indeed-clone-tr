const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bycrypt = require('bcrypt');


const User = require('../database/models/user');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField : 'email'}, (email,password, done)=>{
            User.findOne({email : email}).then(user => {
                if(!user){
                    return done(null, false, {message : 'Wrong password or email!'});
                }
                // Password decrypting
                bycrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }
                    else{
                        return done(null, false, {message : 'Wrong password or email!'})
                    }
                });
            }).catch(err => console.log(err))
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });     
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}