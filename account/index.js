const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
app.use(express.urlencoded({extended: true}))


//app.use(express.static(path.join(__dirname,'/publc')))
//app.use('/user',require('../account'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));

app.get('/dashboard',(req,res)=>{
    const {username}=req.query
    res.render('dashboard',{username})
})

module.exports=app