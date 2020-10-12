const express = require('express');
const router = express.Router();
const Post = require('../database/models/posts');
const Application = require('../database/models/applications');
const WorkExperience = require('../database/models/work_experience');
const User = require('../database/models/user');

router.route('/search').get((req, res, next) => {
    const title = req.query.title;
    const location = req.query.location;
    if (location.length === 0 || location === undefined) {
        Post.find({
            $or: [{
                    title: new RegExp(`${title}`, 'gi')
                },
                {
                    job_description: new RegExp(`${title}`, 'gi')
                }
            ]
        }).then(posts => {
            res.render('jobs/job_list', {
                posts: posts
            });
        }).catch(err => {
            res.redirect('/');
        })
    } else {
        Post.find({
            $or: [{
                    title: new RegExp(`${title}`, 'gi')
                },
                {
                    job_description: new RegExp(`${title}`, 'gi')
                }
            ],
            location: location
        }).then(posts => {
            res.render('jobs/job_list', {
                posts: posts
            });
        }).catch(err => {
            res.redirect('/');
        })
    }
});
router.get('/detail/:id', (req, res, next) => {
    if (req.isAuthenticated()) {
        Application.findOne({
            post: req.params.id,
            user: req.user.id
        }).then(application => {
            if (!application) {
                WorkExperience.find({
                    user : req.user.id
                }).then(experiences => {
                    Post.findById(req.params.id)
                    .then(post => {
                        res.render('jobs/job_post_detail', {
                            post, experiences
                        });
                    }).catch(err => {
                        console.log(err);
                        res.redirect('/');
                    })
                })
            }
            if (application) {
                const applied = true
                Post.findById(req.params.id)
                    .then(post => {
                        res.render('jobs/job_post_detail', {
                            post: post,
                            is_applied: applied
                        });
                    }).catch(err => {
                        console.log(err);
                        res.redirect('/');
                    })
            }
        })
    } else {
        Post.findById(req.params.id)
            .then(post => {
                res.render('jobs/job_post_detail', {
                    post: post
                });
            }).catch(err => {
                console.log(err);
                res.redirect('/');
            })
    }

});
router.post('/apply', (req, res, next) => {
    const {
        postid
    } = req.body;
    Application.findOne({
        post: postid,
        user: req.user.id
    }).then(post => {
        if (!post) {
            const newApplication = new Application({
                user: req.user.id,
                post: postid
            });
            newApplication.save().then(() => {
                console.log("Basvuru yapildi!");
                res.redirect(`/job/detail/${postid}`);
            }).catch(err => {
                console.log(err);
                res.redirect(`/job/detail/${postid}`);
            })
        }
        if (post) {
            console.log('Zaten Basvuru Yapilmis');
            res.redirect(`/job/detail/${postid}`);
        }
    })
})

router.get('/applier/cv/:id', (req,res,next) =>{
    WorkExperience.find({
        user : req.params.id
    }).populate('user').exec((err, results) =>{
        if (err) throw err;
        if (results.length !== 0) {
            const userSkills =  results[0].user.skillList.split(', ');
            res.render('user/applier', {results, modifiedSkills : userSkills});
        }
        else{
            res.render('user/applier', {results});
        }
    });
})
module.exports = router;