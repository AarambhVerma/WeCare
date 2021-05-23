const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
//Import User model
const User = require('../models/User')

router.get("/login",(req,res) => {
    res.render('login')
})

router.get("/register",(req,res) => {
    res.render('register')
})

router.post("/register",(req,res) => {
    const { name, email, password, password2 } = req.body
    let errors = []
    
    if( !name || !email || !password || !password2 ){
        errors.push({
            message: 'Please fill out the required fields'
        })
    }

    if(password !== password2){
        errors.push({
            message: 'Passwords dont match'
        })
    }

    if(password.length < 6){
        errors.push({
            message: 'Password should be atleast 6 characters long'
        })
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else{
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    //user already exists with same email adddress
                    errors.push({message: 'User already exists with this Email'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    // encrypt password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err
                            newUser.password = hash
                            //save the user
                            newUser.save()
                                .then(user => {
                                    res.redirect('/auth/login')
                                })
                                .catch(error => console.log(err));
                        });
                    });
                    
                }
            })
    }
    errors.forEach(error => {
        console.log(error);
    });
})

module.exports = router