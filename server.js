if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
//import dependencies
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

//import routes
const indexRouter = require('./routes/index');
const projectRouter = require('./routes/projects');
const userRouter = require('./routes/users');

//app init
const app = express()

// Passport Config
require('./config/passport')(passport);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit : '10mb' }))
 
// parse application/json
app.use(bodyParser.json())

//mongoDB connection
mongoose.connect(process.env.DATABASE_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})

const db = mongoose.connection

db.once('open',()=>console.log('connected to mongoDB...'))
db.on('error',err => console.error(err))

//view engine setup
app.set('view engine','ejs')
app.set('views' , __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(methodOverride('_method'))

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
// Connect flash
app.use(flash());
  
// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//connecting routes
app.use('/',indexRouter)
app.use('/projects',projectRouter)
app.use('/users',userRouter)

//connecting to server
app.listen(process.env.PORT||3000,()=>{
    console.log('server running on port 3000...')
})