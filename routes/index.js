const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/authcheck')



//template engine route
router.get("/",(req,res) => {
    res.render('index',{
        user : req.user
    })
})


router.get("/about-us",(req,res) =>{
    res.render('about_us',{
        user : req.user
    })
})

router.get("/blog",(req,res) =>{
    res.render('blog',{
        user : req.user
    })
})

router.get("/contact-us",(req,res) =>{
    res.render('contact_us',{
        user : req.user
    })
})

router.get("/gallery",(req,res) =>{
    res.render('gallery',{
        user : req.user
    })
})

router.get("/profile", ensureAuth, (req,res) =>{
    res.render('profile',{
        user : req.user
    })
})

router.get("/services",(req,res) =>{
    res.render('services',{
        user : req.user
    })
})

router.get("/dashboard", ensureAuth, (req,res) =>{
    res.render('dashboard', {
        // user : req.user, // TODO navbar conflict 
        name: req.user.name,
        isAdmin: req.user.isAdmin
    })
})


module.exports = router