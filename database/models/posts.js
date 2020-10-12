const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        maxlength:80,
    },
    job_description : {
        type : String,
        text : true
    },
    company : {
        type :String,
        maxlength:80
    },
    location : {
        type:String,
        maxlength:80
    },
    summary : {
        type:String,
        text:true
    },
    date : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
const jobPost = mongoose.model('jobPost', postSchema);

module.exports = jobPost;