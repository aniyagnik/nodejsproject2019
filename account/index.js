const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
app.use(express.urlencoded({extended: true}))


//app.use(express.static(path.join(__dirname,'/publc')))
app.use('/chat',require('./chat_app'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));


app.get('/dashboard',(req,res)=>{
    console.log('in dashboard',req.user)   
    if(req.user)
    {
        const {username}=req.user
        return res.render('dashboard',{username})
    }
    else{
        res.redirect('/')
    }
   
})

app.get('/chat',(req,res)=>{
    const {username}=req.query
    res.redirect('/user/chat')
})

module.exports=app