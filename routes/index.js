const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/authcheck')
const User = require('../models/User')
const Activity = require('../models/Activity')

// @desc    Show Index Page
// @route   GET /
router.get("/",(req,res) => {
    res.render('index', {
        user : req.user,
        isIndexPage: true
    })
})

// @desc    Show User Dashboard
// @route   GET /
router.get("/dashboard", ensureAuth, async (req,res,next) =>{
    //console.log(req.user);
    try {
        let user = await User.findById(req.user.id)
        .populate('userActivities')
        .lean()

        const adminActivities = await Activity.find({
            authorID: req.user.id,            
        }).lean()

        res.render('dashboard', {
        /* user : req.user,
        name: req.user.name,
        isAdmin: req.user.isAdmin,
        userActivities: req.user.userActivities */
        user,
        adminActivities
    })
    
    } catch (err) {
        console.log(err)
    }
    
    //console.log(user.userActivities[0].name);
})

module.exports = router