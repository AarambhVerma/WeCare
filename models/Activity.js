const mongoose = require('mongoose')

const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },    
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // volunteers: {
    //     value: []
    // },
    activityDate: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    }  
})

const Activity = mongoose.model('Activity', ActivitySchema)

module.exports = Activity