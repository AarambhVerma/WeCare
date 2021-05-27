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
            newDate = date.toLocaleDateString()
            return newDate
        } catch (error) {
            console.log(error)
        }
    }
    
}