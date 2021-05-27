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
        res.render('error/500')
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
            location : activityLocation
        })
        
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        res.render('error/500')
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
        return res.render('error/500')
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
            res.render('error/404')
        }
    
        // check to see if the user is the owner of the activity
        if(activity.authorID != req.user.id){
            res.redirect('/activity')
            /* res.render('activity/edit', {
                activity,
            }) */
        } else{
            res.render('activity/edit', {
                activity,
            })
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500')
    }
})

// @desc    Update activity
// @route   PUT /activity/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let activity = await Activity.findById(req.params.id).lean()

        if(!activity){
            return res.render('error/404')
        }
        console.log(activity)

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
            console.log(req.body)
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500')
    }
})

// @desc    Show single activity
// @route   GET /activity/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let activity = await Activity.findById(req.params.id)
            .populate('user')
            .lean()
        let activityAuthor = await User.findById(activity.authorID)
            .lean()

        if(!activity) {
            return res.render('error/404')
        }

        res.render('activity/single_activity', {
            activity,
            activityAuthor
        })
    } catch (err) {
        console.error(err);
        res.render('error/404')
    }
})

// @desc    Show User Activities
// @route   GET /activity/user/:userId
// router.get('/user/:userId', ensureAuth, async (req, res) => {
//     try {
//         const activities = await Activity.find({
//             authorID: req.params.authorID,            
//         }).populate('user')
//         .lean()
//         console.log(authorID);
//         console.log(activities);
        

//         res.render('activity/index', {
//             activities
//         })
//     } catch (err) {
//         console.error(err);
//         res.render('error/500')
//     }
// })

// @desc    404 page
// @route   GET activity/*
router.get("*",(req,res) => {
    res.render('error/404')
})

module.exports = router