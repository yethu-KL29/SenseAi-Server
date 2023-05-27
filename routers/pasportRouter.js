const passportRouter = require('express').Router();
const passport = require('passport');
const Google = require('../models/googleModel');


passportRouter.get('/google/callback', passport.authenticate('google',
    {
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/failure'
    }));






passportRouter.get('/login/failure', (req, res) => {

    res.send('Failed to authenticate..');


});

passportRouter.get('/login/success', async(req, res) => {
    if (!req.user) {
        res.redirect('/auth/callback/failure');
    } else {
        
        const googleUser = new Google({
            name: req.user.displayName,
            email: req.user.emails[0].value,
            googleId: req.user.id,
            createdAt: req.user._json.created_at,
            profilePicture: req.user._json.profile_image_url_https
        });
        
        res.status(200).json({
            message: 'User authenticated successfully',
            user: req.user
        });
        console.log(req.user.displayName)

    }
});





module.exports = passportRouter;

