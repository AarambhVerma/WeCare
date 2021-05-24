const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/User')

module.exports = passport => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({ email: email })
                .then(user => {
                    if(!user){ // if user does not exist
                        return done(null, false, {message: "This Email isn't registered"})
                    }
                    // match the password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err
                        if(isMatch) {
                            return done(null, user)
                        } else{
                            return done(null, false, {message: "The password isn't correct"})
                        }
                    })
                })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}