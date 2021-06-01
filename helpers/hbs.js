const Activity = require("../models/Activity")

module.exports = {
    validateValues: value => {
        if (value != undefined){
            return value
        } else{
            return ''
        }
    },
    customDate: date => {
        try {
            date = date.toLocaleDateString()
            date = date.split("/")
            date[0] = (date[0] > 9) ? date[0] : `0${date[0]}`
            date[1] = (date[1] > 9) ? date[1] : `0${date[1]}`
            date = `${date[2]}-${date[0]}-${date[1]}`
            return date
        } catch (error) {
            console.log(error)
        }
    },
    checkAdmin: (val,options) => {
        if(val === 'NGO'){
            return options.fn(this)
        }else {
            return options.inverse(this)
        }
    },
    checkVolunteer: (val,options) => {
        if(val === 'Volunteer'){
            return options.fn(this)
        }else {
            return options.inverse(this)
        }
    },
    ensureAuthor: (user, activities) => {
        if(user._id === activities.authorID){
            return true
        } else{
            return false
        }
    },
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
          let new_str = str + ' '
          new_str = str.substr(0, len)
          new_str = str.substr(0, new_str.lastIndexOf(' '))
          new_str = new_str.length > 0 ? new_str : str.substr(0, len)
          return new_str + '...'
        }
        return str
    },
}