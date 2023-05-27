const passportRouter = require('express').Router();
const passport = require('passport');


passportRouter.get('/google/callback', passport.authenticate('google',
    {
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/failure'
    }));






passportRouter.get('/login/failure', (req, res) => {

    res.send('Failed to authenticate..');


});

passportRouter.get('/login/success', (req, res) => {
    if (!req.user) {
        res.redirect('/auth/callback/failure');
    } else {
        
      
        console.log(req.user);
   

        res.status(200).json({
            message: 'User authenticated successfully',
            user: req.user
        });

    }
});





module.exports = passportRouter;

