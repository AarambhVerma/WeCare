const express = require("express");
const connectDB = require("./db/connection")
const path = require("path");
const hbs = require("hbs");
const methodOverride = require('method-override')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')

dotenv.config({path: './config.env'})

connectDB()

const app = express();

//passport config
require('./passport')(passport)

const templatePath = path.join(__dirname,"templates/views")
// const layoutPath = path.join(__dirname,"templates/layouts")
const partialsPath = path.join(__dirname,"templates/partials")

//built in middleware
app.use(express.static(path.join(__dirname, "../public")))

//handlebar custom helpers
const { validateValues, customDate } = require('../helpers/hbs');
// const passport = require("passport");

//handlebars setup
app.set('view engine', 'hbs');
app.set('views',templatePath)

hbs.registerPartials(partialsPath)

hbs.registerHelper('validateValues', validateValues)
hbs.registerHelper('customDate', customDate)

//Body Parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//method override
app.use(
    methodOverride((req,res) => {
        if(req.body && typeof req.body === 'object' && '_method' in req.body){
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)
//express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI,
        mongooseConnection: mongoose.connection }),
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/", require('../routes/index'))
app.use("/auth", require('../routes/auth'))
app.use("/activity", require('../routes/activity'))


const PORT = process.env.PORT || 3000

//listen
app.listen(PORT, () => {
    console.log(`listen to port ${PORT}`)
})