const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const appError = require('../appError')


router.get('/info', (req, res) => {
    res.render('registration/info')
})

router.get('/register', (req, res) => {
    res.render('registration/register')
})

router.post('/register', async (req, res) => {
    try {
        const { username, email, number, password, cpassword } = req.body;
        if (password === cpassword) {
            const user = new User({
                username,
                email,
                number
            })
            const registeredUser = await User.register(user, password)
            req.flash('success', 'Successfully created your Account')
            res.redirect('/register')
        }
        else {
            req.flash('error', "Passwords not matched")
            res.redirect('/register')
        }

    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

})

router.get('/login', (req, res) => {
    res.render('registration/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    try {
        req.flash('success', `Welcome Back!`)
         const redirectBack = req.session.returnTo || '/campgrounds'
        delete req.session.returnTo;
        res.redirect(redirectBack);
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/login')
    }
})

router.get('/logout', async(req,res,next) => {
    req.logout((err)=> {
        if(err){
            return next(err)
        }
    })
    req.flash('success', `Good Bye`)
    res.redirect('/')
})

module.exports = router;
