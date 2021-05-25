const express = require('express')
const router = express.Router()
const { check } = require("express-validator")
const { ensureAuth } = require('../middleware/authcheck')
const User = require('../models/User')
const Activity = require('../models/Activity')
const adminAuthorID = '60ab2d22b1e0300fc4d013c9'

//Show all stories
/* router.get('/', ensureAuth, (req, res) => {
    res.render('Activity')
})
 */

//Add activities
router.get("/form", ensureAuth, (req,res) =>{
    res.render('form')
})


//get activity detail
/* router.get("/add",ensureAuth,(req,res) => {
    res.redirect('/activity/add/')
}) */
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
            name : activityName,
            description : activityDescription,
            authorID : adminAuthorID,
            activityDate : activityDate,
            location : activityLocation
        })
        //console.log(activityName + " " + activityDescription)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        //res.render('error/500')
    }
})


//get all activities
router.get('/', ensureAuth, async (req, res) => {
    try {
        console.log("in get all activities")
        const activities = await Activity.find()
            .populate('User')
            .lean();
            /* .sort({ createdAt: 'desc'}) */
            
           // console.log(activities);

        res.render('show_activities', {
            activities,
        })
    } catch (err) {
        console.error(err);
        //res.render('error/500')
    }
})

//delete activity
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Activity.deleteOne({ _id: req.params.id })
        res.redirect('/activity')
    } catch (err) {
        console.error(err);
        //return res.render('error/500')
    }
})
//update activity 

module.exports = router
