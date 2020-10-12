const mongoose = require('mongoose');
const User = require('./user');
const ExperienceSchema = new mongoose.Schema({
    position : {
        type:String,
        maxlength:80
    },
    companyName : {
        type:String,
        maxlength:80
    },
    companyLocation : {
        type:String,
        maxlength:80
    },
    still_working: {
        type:Boolean,
        default:false
    },
    start_date : {
        type:String,
        maxlength:40
    },
    end_date : {
        type:String,
        maxlength:40
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const WorkExperience = mongoose.model('WorkExperience', ExperienceSchema);
module.exports = WorkExperience;