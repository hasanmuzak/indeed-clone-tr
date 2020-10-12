const express = require('express');
const router = express.Router();
const User = require('../../database/models/user');
const WorkExperience = require('../../database/models/work_experience');
router.route('/profile')
    .get((req, res, next) => {
        res.render('resume/profile', {
            user: req.user
        });
    })
    .post(async (req, res, next) => {
        const {
            first_name,
            last_name,
            profile_location,
            phone_number,
            show_my_number,
        } = req.body;
        req.user.phoneNumber = null;
        await req.user.save();
        User.findOne({
            phoneNumber: phone_number
        }).then(async user => {
            if (!user) {
                req.user.first_name = first_name;
                req.user.last_name = last_name;
                req.user.phoneNumber = phone_number;
                if (show_my_number === 'on') {
                    req.user.show_number = true;
                }
                req.user.location = profile_location;
                await req.user.save().then(() => {
                    res.redirect('/resume/wizard/education');
                }).catch(err => {
                    console.log(err);
                });
            }
            if (user) {
                res.redirect('/resume/wizard/profile');
            }
        });
    });


router.route('/education')
    .get((req, res, next) => {
        res.render('resume/education', {
            user: req.user
        });
    })
    .post(async (req, res, next) => {
        const {
            education_level,
            graduated_school,
            department,
            education_location,
            still_student,
            start_month,
            start_year,
            end_month,
            end_year
        } = req.body;
        req.user.educational_level = education_level;
        req.user.school = graduated_school;
        req.user.department = department;
        req.user.school_location = education_location;
        req.user.school_start_date = `${start_month} - ${start_year}`;
        if (still_student === 'on') {
            req.user.is_student = true;
            req.user.graduate_date = null;
        }
        if (still_student === undefined) {
            req.user.is_student = false;
            req.user.graduate_date = `${end_month} - ${end_year}`;
        }
        req.user.save();
        res.redirect('/resume/wizard/experience');
    });


router.route('/experience')
    .get((req, res, next) => {
        WorkExperience.find({
            user: req.user.id
        }).then(experienceList => {
            if (!experienceList) {
                res.render('resume/experience');
            }
            if (experienceList) {
                res.render('resume/experience', {
                    experienceData: experienceList
                });
            }
        }).catch(err => {
            console.log(err);
        })
    })
    .post(async (req, res, next) => {
        const {
            job_position,
            company,
            job_location,
            job_still_working,
            job_start_month,
            job_start_year,
            job_end_month,
            job_end_year
        } = req.body;
        if (job_position.length == 0 || company.length == 0 || job_location.length == 0 || job_still_working.length == 0 || job_start_month.length == 0){
            res.redirect('/resume/wizard/skills');
        }
        else{
            const newExperience = new WorkExperience({
                position: job_position,
                companyName: company,
                companyLocation: job_location,
                user: req.user.id,
                start_date: `${job_start_month} - ${job_start_year}`
            });
            if (job_still_working !== 'on') {
                newExperience.still_working = false;
                newExperience.end_date = `${job_end_month} - ${job_end_year}`;
            }
            if (job_still_working === 'on') {
                newExperience.still_working = true;
            }
            await newExperience.save().then(() => {
                res.redirect('/resume/wizard/skills');
            }).catch(err => {
                res.redirect('/resume/wizard/experience');
                console.log(err);
            });
        }
    });

router.post('/experience/delete/:id', (req, res, next) => {
    const experienceId = req.params.id;
    console.log(experienceId);
    WorkExperience.findByIdAndDelete(experienceId)
        .then(() => {
            res.redirect('/resume/wizard/experience');
        }).catch(err => {
            console.log(err);
            res.redirect('/resume/wizard/experience');
        });
});

router.route('/skills')
    .get((req, res, next) => {
        req.user.skillList = null;
        req.user.save();
        res.render('resume/skills');
    })
    .post((req, res, next) => {
        const {
            skill_list
        } = req.body;
        req.user.skillList = skill_list;
        req.user.save().then(() => {
            res.redirect('/resume/wizard/review')
        }).catch(err => {
            console.log(err);
        });
    });


router.route('/review')
.get((req,res,next)=>{
    WorkExperience.find({
        user: req.user.id
    }).then(experience => { 
        if(experience.length !== 0){
            if(req.user.skillList != null){
                const userSkills =  req.user.skillList.split(', ');
                res.render('resume/review', {user : req.user, experienceData : experience, modifiedSkills : userSkills});
            }
            else{
                res.render('resume/review', {user : req.user, experienceData : experience});
            }
        }
        else{
            res.render('resume/review', {user : req.user, experienceData : experience});
        }
    }).catch(err => {
        console.log(err);
        res.render('resume/review', {user : req.user});
    })
    
})
module.exports = router;