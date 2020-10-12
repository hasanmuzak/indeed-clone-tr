const registerRouter = require('./register');
const express = require('express');
const router = express.Router();
const Post = require('../../database/models/posts');
const {
    onlyEmployerAllowed
} = require('../../config/auth');
const Application = require('../../database/models/applications');

router.route('/register').post(registerRouter);

router.route('/create/post')
    .get(onlyEmployerAllowed, (req, res, next) => {
        res.render('employer/create_post');
    })
    .post(onlyEmployerAllowed, (req, res, next) => {
        const {
            post_title,
            post_company,
            post_description,
            post_location,
            job_detail
        } = req.body;
        const newPost = new Post({
            title: post_title,
            job_description: job_detail,
            company: post_company,
            location: post_location,
            summary: post_description,
            user: req.user.id
        });
        newPost.save().then(() => {
            res.redirect('/employer/list/posts');
        }).catch(err => {
            console.log(err);
            res.redirect('/')
        })
    });

router.route('/list/posts').get(onlyEmployerAllowed,(req,res,next)=>{
    Post.find({
        user : req.user.id
    }).then(posts => {
        res.render('employer/list_post', {posts : posts});
    }).catch(err=>{
        console.log(err);
        res.render('employer/list_post');
    })
})

router.route('/list/posts/:id').get(onlyEmployerAllowed,(req,res,next)=>{
    Application.find({post : req.params.id}).populate('user').populate('post').exec((err,results) => {
        if (err) throw err;
        res.render('employer/list_post_detail', {result : results});
    })

    // Post.findById(req.params.id).then(post => {
    //     
    // }).catch(err=>{
    //     console.log(err);
    //     res.render('employer/list_post');
    // })
})
module.exports = router;