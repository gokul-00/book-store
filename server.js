if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');

const indecRouter = require('./routes/index');

const app = express()

mongoose.connect(process.env.DATABASE_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})

const db = mongoose.connection

db.once('open',()=>console.log('connected to mongoDB...'))
db.on('error',err => console.error(err))

app.set('view engine','ejs')
app.set('views' , __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

app.use('/',indecRouter)

app.listen(process.env.PORT||3000,()=>{
    console.log('server running on port 3000...')
})