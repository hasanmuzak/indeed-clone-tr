const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        maxlength : 120,
        lowercase:true,
        unique:true
    },
    is_employer : {
        type:Boolean,
        default:false
    },
    email_token : {
        type:String
    },
    first_name : {
        type : String,
        maxlength : 80,
    },
    last_name : {
        type : String,
        maxlength : 80,
    },
    password : {
        type : String,
        required : true
    },
    show_number : {
        type: Boolean,
        default: false
    },
    phoneNumber : {
        type: String,
        maxlength:15
    },
    location : {
        type:String,
        maxlength:20
    },
    educational_level : {
        type:String,
        maxlength: 60
    },
    school : {
        type : String,
        maxlength : 100
    },
    school_location : {
        type:String,
        maxlength:20
    },
    department : {
        type:String,
        maxlength:80
    },
    is_student : {
        type : Boolean,
        default: false
    },
    school_start_date : {
        type : String,
        maxlength : 20
    },
    graduate_date : {
        type : String,
        maxlength : 20
    },
    skillList : {
        type:String,
        maxlength:200,
        default : null
    },
    date : {
        type : Date,
        default : Date.now
    },
    is_verified : {
        type : Boolean,
        default : false
    },
    showCv : {
        type : Boolean,
        default : true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;