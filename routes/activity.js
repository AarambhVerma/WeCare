const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/authcheck')
const User = require('../models/User')
const Activity = require('../models/Activity')

//Show all stories
router.get('/', ensureAuth, (req, res) => {
    res.render('Activity')
})

//Add Stories
router.get('/add', ensureAuth, (req, res) => {
    res.send('Stories to be added here')
})

module.exports = router
