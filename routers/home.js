const express = require('express');
const router = express.Router();
const User = require('../database/models/user');



router.get('/', (req,res,next)=>{
    res.render('home');
});

router.get('/verify-email',(req,res)=>{
try {
    User.findOne({email_token : req.query.token}).then(user => {
        if (!user) {
            res.redirect('/');
        }
        else{
            user.email_token = null;
            user.is_verified = true;
            user.save();
            res.redirect('/resume/wizard/profile')
        }
    });
    
} catch (error) {
    console.log(error);
    res.redirect('/');
}
});

router.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/user/login');
})


module.exports = router;