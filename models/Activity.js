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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Activity = mongoose.model('Activity', ActivitySchema)

module.exports = Activity