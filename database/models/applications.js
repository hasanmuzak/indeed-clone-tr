const mongoose = require('mongoose');

const applicationsSchema = new mongoose.Schema({
    date : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'jobPost'
    }
})
const Application = mongoose.model('Applications', applicationsSchema);

module.exports = Application;