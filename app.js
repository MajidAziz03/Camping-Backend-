


if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const appError = require('./appError')
const Review = require('./models/reviews')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const MongoDBStore = require('connect-mongodb-session')(session);




// **************** Routes **************************

const homeRoutes = require('./routes/campgroundRoutes')
const userRoutes = require('./routes/userRoutes')


// **************** Model **************************

const Campground = require('./models/campground')
const User = require('./models/user')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camping'
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "error occured in databse"))
db.once("Open", () => {
    console.log("Database Connected")
})


const app = express()
const port = process.env.port || 3000


app.set('view engine', 'ejs')
app.set('views', 'views')
app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/', homeRoutes)
app.use('/', userRoutes)

const secret = process.env.SECRET || 'thereshouldbeascret'

const store = new MongoDBStore({
    url : dbUrl,
    secret,
    touchAfter : 24 * 60 * 60,
})

store.on("error", function (e) {
    console.log("Error in Store",e)
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.all('*', (req, res, next) => {
    throw new (appError("Not Found", 404))
})

app.use((err, req, res, next) => {
    const { message = "Something went wrong", status = 500 } = err
    res.status(status).send(message)

})

// to install mapbox npm install @mapbox/mapbox-sdk  

app.listen(port, ()=> {
    console.log(`Listening at port : ${port}`)
})

