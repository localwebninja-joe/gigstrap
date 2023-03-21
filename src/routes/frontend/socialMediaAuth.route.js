const express = require('express');
const passport = require('passport');
require('../../config/passport-setup');
const crypto = require('crypto');

const router = express.Router();
const nonce = crypto.randomBytes(16).toString('base64');
    
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
};

// Define a middleware function to remove the Facebook hash
router.use((req, res, next) => {
  if (req.url.indexOf("#_=_") > -1) {
    const cleanUrl = req.url.replace(/#.*/, "");
    res.redirect(301, cleanUrl);
  } else {
    next();
  }
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/failed', (req, res) => res.send('You Failed to log in!'))

router.get('/good', isLoggedIn, (req, res) => {
    console.log(req.user._json)
    res.render('pages/profile.ejs',{
        name:req.user.displayName,
        pic:req.user._json.picture,
        email:req.user.emails[0].value,
        profile: "google"
    })
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', 
    {failureRedirect: '/failed'}), 
    (req, res) => {
        res.redirect('/good');
    })

router.get('/profile',  (req,res) => {
    console.log("----->",req.user)
    res.set({
        'Content-Security-Policy': `script-src 'nonce-${nonce}'`
    });
    res.render('pages/profile', {
        nonce: nonce,
        profile: "facebook",
        name:req.user.displayName,
        pic:req.user.photos[0].value,
        email:req.user.emails[0].value // get the user out of session and pass to template
    });
})

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get('/auth/linkedin', 
    passport.authenticate('linkedin', {
        scope : ['r_emailaddress', 'r_liteprofile'] 
    }
));

router.get('/auth/twitter', 
    passport.authenticate('twitter', {
        scope : ['r_emailaddress', 'r_liteprofile'] 
    }
));

router.get('/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect : '/profile',
        failureRedirect : '/'
    }
));

router.get('/twitter/callback',
	passport.authenticate('twitter', {
		successRedirect : '/profile',
        failureRedirect : '/'
    }
));

router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        successRedirect: '/good',
        failureRedirect: '/'
    }
));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;