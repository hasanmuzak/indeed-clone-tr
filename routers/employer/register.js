const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const passport = require('passport');
const transporter = require('../../config/transporter');
// Model 
const User = require('../../database/models/user');

const {dontAllowIfAuthenticated} = require('../../config/auth');

module.exports = (async (req,res,next)=>{
    const {email, password} = req.body;
    User.findOne({email : email})
    .then(user => {
        if(user){
            res.redirect('/');
        }
        else{
            const newUser = new User({
                email,
                password,
                email_token : crypto.randomBytes(48).toString('hex'),
                is_employer : true
            });
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, async (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    await newUser.save().then(async ()=>{
                        const mailOptions = {
                            from: 'hasanmuzaktest@gmail.com',
                            to: newUser.email,
                            subject : 'Indeed-Clone Email Verification',
                            html : `
                            <h3>Hello,</h3>
                            <p>Thank you for registering my Indeed-Clone project.</p>
                            <p>In order to continue, you need to verify your account. Please click the link below!</p>
                            <a href="https://${req.headers.host}/verify-email?token=${newUser.email_token}">Verify Account</a>
                            If it doesn't work, copy and paste this url: https://${req.headers.host}/verify-email?token=${newUser.email_token}
                            `
                        }
                        await transporter.sendMail(mailOptions, (err,info)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log('Email has sent successfuly!');
                            }
                        });
                        passport.authenticate('local', {
                            successRedirect: '/',
                            failureRedirect: '/user/login'
                        })(req,res,next)
                    })
                    .catch(err=>{
                        console.log(err);
                    });
                })
            });
        }
    })
});