module.exports = {
    ensureAuth: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect('/auth/login')
    },
    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next()            
        } else{
            res.redirect('/dashboard')
        }
    },

    // ensureAdmin: function (req, res, next) {
    //     if(req.user.isAdmin === "Volunteer"){
    //         return next()
    //     } else{
    //         return 
    //     }
    // }
}