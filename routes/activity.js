const express = require('express')
const router = express.Router()
const { check } = require("express-validator")
const { ensureAuth } = require('../middleware/authcheck')
const User = require('../models/User')
const Activity = require('../models/Activity')


// @desc    show All Activities
// @route   GET /
router.get('/', ensureAuth, async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate('authorID')
            .sort({ createdAt: 'desc'})
            .lean();

        res.render('activity/show_activities', {
            activities,
        })
    } catch (err) {
        console.error(err);
        res.render('error/500', {
            layout: 'error'
        })
    }
})

// @desc    show add page
// @route   GET /form
router.get("/add", ensureAuth, (req,res) =>{
    try {
        if(req.user.isAdmin === "NGO"){
            res.render('activity/add')
        } else{
            res.redirect('/dashboard')
        }
          
    } catch (error) {
        console.log(error);
        res.render('error/500', {
            layout: 'error'
        })
    }    
})

// @desc     process of adding activity
// @route    POST /
router.post('/', ensureAuth,[
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
            location : activityLocation,
            volunteers: []
        })
        
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        res.render('error/500', {
            layout: 'error'
        })
    }
})

// @desc    Delete activity
// @route   DELETE /:id
router.delete('/:id', ensureAuth, async (req, res) => {
    
    try {
        const activity = await Activity.findOne({
            _id: req.params.id
        }).lean()
        if(activity.authorID != req.user.id){
            res.redirect('/activity')
            
        }else{
            await Activity.deleteOne({ _id: req.params.id })
            res.redirect('/activity')
        }
        
    } catch (err) {
        console.error(err);
        return res.render('error/500', {
            layout: 'error'
        })
    }
})

// @desc    Show Edit page
// @route   GET activity/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const activity = await Activity.findOne({
            _id: req.params.id
        }).lean()
    
        if(!activity){
            res.render('error/404', {
                layout: 'error'
            })
        }
    
        // check to see if the user is the owner of the activity
        if(activity.authorID != req.user.id){
            res.redirect('/activity')
        } else{
            res.render('activity/edit', {
                activity,
            })
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500', {
            layout: 'error'
        })
    }
})

// @desc    Update activity
// @route   PUT /activity/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let activity = await Activity.findById(req.params.id).lean()

        if(!activity){
            return res.render('error/404', {
                layout: 'error'
            })
        }
        // check to see if the user is the owner of the activity
        if(activity.authorID != req.user.id){
            res.redirect('/activity')
            
        } else{
            activity = await Activity.findOneAndUpdate({ _id: req.params.id }, {
                authorID : req.user.id,
                name : req.body.activityName,
                description : req.body.activityDescription,            
                activityDate : req.body.activityDate,
                location : req.body.activityLocation
            } , {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500', {
            layout: 'error'
        })
    }
})

// @desc    Show single activity
// @route   GET /activity/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let activity = await Activity.findById(req.params.id)
            .populate('authorID')
            .lean()
        if(!activity) {
            return res.render('error/404')
        }

        res.render('activity/single_activity', {
            activity
        })
    } catch (err) {
        console.error(err);
        res.render('error/404', {
            layout: 'error'
        })
    }
})

//@desc    Show User Activities
//@route   GET /activity/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const activities = await Activity.find({
            authorID: req.params.userId,            
        }).populate('authorID')
        .lean()

        const author = await User.findOne({
            _id: req.params.userId
        })
            .lean()

        res.render('activity/more_from_author', {
            activities,
            authorName: author.name
        })
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})

// @desc    Enroll in activtiy
// @route   POST activity/enroll/:id
router.post("/enroll/:id", ensureAuth, async (req, res) => {
    try {
        if(req.user.isAdmin !== "NGO"){
            const enrollID = await Activity.findOneAndUpdate(
                { 
                    _id : req.params.id,
                },
                {
                    $addToSet: {
                        volunteers : req.user.id,
                    },
                })
            const activityID = await User.findOneAndUpdate(
                {
                    _id : req.user.id,
                },
                {
                    $addToSet: {
                        userActivities : req.params.id,
                    }
                }
            )
                res.redirect('/dashboard')
        }else{
            res.redirect('/activity')
        }
        
    } catch (err) {
        res.render('error/500')
    }
})

// @desc    unEnroll in activtiy
// @route   Delete activity/unenroll/:id
router.delete("/unenroll/:id", ensureAuth, async (req, res) => {
    console.log("in unenroll")
    try {
        if(req.user.isAdmin !== "NGO")
        {
            console.log("deleted")
            const enrollID = await Activity.findOneAndUpdate(
                { 
                    _id : req.params.id,
                },
                {
                    $pull: {
                        volunteers : req.user.id,
                    },
                })
            const activityID = await User.findOneAndUpdate(
                {
                    _id : req.user.id,
                },
                {
                    $pull: {
                        userActivities : req.params.id,
                    }
                }
            )
                res.redirect('/dashboard')
        }else{
            res.redirect('/activity')
        }
        
    } catch (err) {
        res.render('error/500')
    }
})
// @desc    404 page
// @route   GET activity/*
router.get("*",(req,res) => {
    res.render('error/404', {
        layout: 'error'
    })
})

module.exports = router
