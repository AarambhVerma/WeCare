const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/authcheck')



//template engine route
router.get("/",(req,res) => {
    res.render('index')
})


router.get("/about-us",(req,res) =>{
    res.render('about_us')
})

router.get("/blog",(req,res) =>{
    res.render('blog')
})

router.get("/contact-us",(req,res) =>{
    res.render('contact_us')
})

router.get("/gallery",(req,res) =>{
    res.render('gallery')
})

router.get("/profile", ensureAuth, (req,res) =>{
    res.render('profile')
})

router.get("/services",(req,res) =>{
    res.render('services')
})

router.get("/dashboard", ensureAuth, (req,res) =>{
    res.render('dashboard', {
        name: req.user.name,
        isAdmin: req.user.isAdmin
    })
})


module.exports = router