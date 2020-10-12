const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth : {
        user : process.env.gmailUser,
        pass: process.env.appPassword
    }
})

module.exports = transporter;