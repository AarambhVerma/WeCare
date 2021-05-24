const express = require("express");
const connectDB = require("./db/connection")
const path = require("path");
const hbs = require("hbs");
// const { connect } = require("../routes/index");
const dotenv = require('dotenv')
const session = require('express-session')
const passport = require('passport')

dotenv.config({path: './config.env'})

connectDB()

const app = express();

//passport config
require('./passport')(passport)

const templatePath = path.join(__dirname,"templates/views")
const partialsPath = path.join(__dirname,"templates/partials")

//built in middleware
app.use(express.static(path.join(__dirname, "../public")))

//handlebar custom helpers
const { validateValues } = require('../helpers/hbs');
// const passport = require("passport");

//handlebars setup
app.set('view engine', 'hbs');
app.set('views',templatePath)
hbs.registerPartials(partialsPath)

hbs.registerHelper('validateValues', validateValues)

//Body Parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require('../routes/index'))
app.use("/auth", require('../routes/auth'))

const PORT = process.env.PORT || 5000;

//listen
app.listen(PORT, () => {
    console.log(`listen to port ${PORT}`)
})