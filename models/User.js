const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        default: "Volunteer",
        enum: ['Volunteer', 'NGO']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userActivities: [{
        type: mongoose.Schema.Types.ObjectId,
        require: false,
        ref:'Activity'
    }],
})

const User = mongoose.model('User', UserSchema)

module.exports = User