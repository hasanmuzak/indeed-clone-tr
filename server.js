const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const nunjucks = require('nunjucks');
const port = process.env.PORT;
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
//Passport Config
require('./config/passport')(passport);
const {isUserAuthenticated} = require('./config/auth');

//Database Settings
const mongoose = require('mongoose');
const db = require('./config/db');
//MongoDB Connection

mongoose.connect(db.mongoURL, {useNewUrlParser: true, useUnifiedTopology:true , useCreateIndex:true}).then(()=>{
    console.log('Connected to Mongodb!');
}).catch(err =>{
    console.log(err);
})
//Session

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: false
  }))
app.use(passport.initialize());
app.use(passport.session());
//Global Variables
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    next();
})
//Routers

const homeRouter = require('./routers/home');
const userRouter = require('./routers/user/user');
const resumeRouter = require('./routers/user/resume');
const employerRouter = require('./routers/employer/employer');
const jobsRouter = require('./routers/job');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch:true
});
app.set('view engine', 'njk');


// Routers
app.use(homeRouter);
app.use('/user', userRouter);
app.use('/employer', employerRouter);
app.use('/resume/wizard',isUserAuthenticated,resumeRouter);
app.use('/job',jobsRouter);




app.listen(port, ()=>{
    console.log(`Server has started on ${port}`);
})