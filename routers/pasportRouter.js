const passportRouter = require('express').Router();
const passport = require('passport');
const Google = require('../models/googleModel');


passportRouter.get('/google/login', passport.authenticate('google',
    {
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/failure'
    }));






passportRouter.get('/login/failure', (req, res) => {

    res.send('Failed to authenticate..');


});

passportRouter.get('/login/success', async(req, res) => {
    if (!req.user) {
        res.redirect('/auth/login/failure');
    } else {
        
        const googleUser = new Google({
            name: req.user.displayName,
            email: req.user.emails[0].value,
            googleId: req.user.id,
            profilePicture: req.user.photos[0].value
        });

        await googleUser.save();
        
        res.status(200).json({
            message: 'User authenticated successfully',
            user: req.user
        });
        console.log(req.user.displayName)

    }
});





module.exports = passportRouter;

