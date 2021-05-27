const express = require('express')
const router = express.Router()
const { check } = require("express-validator")
const { ensureAuth } = require('../middleware/authcheck')
const User = require('../models/User')
const Activity = require('../models/Activity')

//@desc show add page
//@route GET /form
router.get("/add", ensureAuth, (req,res) =>{
    res.render('activity/add')
})



//@desc process of adding activity
//@route POST /add
router.post('/add', ensureAuth,[
    check('req.activityName').not().isEmpty(),
    check('req.activityDescription').not().isEmpty(),
    check('req.activityLocation').not().isEmpty()
], async (req, res) => {
    try {
        let activityName = req.body.activityName
        let activityDescription = req.body.activityDescription
        let activityDate = req.body.activityDate
        let activityLocation = req.body.activityLocation
        await Activity.create({
            authorID : req.user.id,
            name : activityName,
            description : activityDescription,            
            activityDate : activityDate,
            location : activityLocation
        })
        
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})

//@desc show All Activities
//@route GET /
router.get('/', ensureAuth, async (req, res) => {
    try {
        // console.log("in get all activities")
        const activities = await Activity.find()
            .populate('User')
            .lean(); 
           // console.log(activities);

        res.render('activity/show_activities', {
            activities,
        })
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})

// @desc    Delete story
// @route   DELETE /:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Activity.deleteOne({ _id: req.params.id })
        res.redirect('/activity')
    } catch (err) {
        console.error(err);
        return res.render('error/500')
    }
})


//@desc Show Edit page
//@route GET /form/:id
router.get("/form/:id", ensureAuth, async (req,res) =>{
    const activity = await Activity.findOne({
        _id: req.params.id
    }).lean()

    if(!Activity){
        return res.render('error/404')
    }
})

//@desc Update activity
//@route PUT /form/:id
router.put("/:id", ensureAuth, async (req,res) =>{
    let activity = await Activity.findById(req.params.id).lean()
    
    if(!Activity){
        return res.render('error/404')
    }

    //tommmow methodOverride,helper,code refactor
})


router.get("*",(req,res) => {
    res.render('error/404')
})

module.exports = router
