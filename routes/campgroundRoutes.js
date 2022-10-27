const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const User = require('../models/user')
const methodOverride = require('method-override')
const appError = require('../appError')
const Review = require('../models/reviews')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const { isLoggedIn } = require('../middleware')




router.use(methodOverride('_method'))

const sessionConfig = {
    secret: 'thereshouldbeascret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

router.use(session(sessionConfig));

router.use(flash());


router.use(passport.initialize())
router.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


router.use((req, res, next) => {
    console.log(session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


router.get('/', (req, res) => {
    res.render('home')
})


router.get('/campgrounds', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({})
        if (!campgrounds) {
            next(new appError('Not found', 404))
        }
        res.render('campground/index', { campgrounds })

    } catch (e) {
        next(e)
    }
})

router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render('campground/new')
})

router.post('/campgrounds', isLoggedIn,  async (req, res, next) => {
    try {
        const { title, location, description, price } = req.body;
        const camp = new Campground({
            title,
            location,
            description,
            price
        })
        await camp.save()
        req.flash('success', 'Successfully made a new campground')
        res.redirect(`/campgrounds/${camp._id}`)
    }
    catch (e) {
        req.flash('error', e.message)
        next(e)
    }
})





router.get('/campgrounds/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        const camp = await Campground.findById(id)
        if (!camp) {
            next(new appError("Camp not found try with valid id", 404))
        }
        res.render('campground/show', { camp })
    }
    catch (e) {
        next(e)
    }
})


router.get('/campgrounds/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campground/edit', { camp })
})


router.put('/campgrounds/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params
        const camp = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
        await camp.save()
        req.flash('success', 'Successfully Edited')
        res.redirect(`/campgrounds/${camp._id}`)
    }
    catch (e) {
        req.flash('error', e.message)
        next(e)
    }
})

router.delete('/campgrounds/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params
        const camp = await Campground.findByIdAndDelete(id)
        req.flash('success', `${camp.title} has been deleted successfully`)
        res.redirect('/campgrounds')
    }
    catch (e) {
        req.flash('error', e.message)
        next(e)
    }
})




module.exports = router;