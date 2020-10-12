const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    date : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
const cvModel = mongoose.model('CV', cvSchema);

module.exports = cvModel;