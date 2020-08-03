if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
//import dependencies
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//import routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
//app init
const app = express()

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

//connecting routes
app.use('/',indexRouter)
app.use('/authors',authorRouter)

//connecting to server
app.listen(process.env.PORT||3000,()=>{
    console.log('server running on port 3000...')
})