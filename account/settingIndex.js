const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const {insert_friendRequest,get_friendRequest,delete_friendRequest,add_friend,get_friends,delete_friend}=require('../database/friendsCollection')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
hbs.registerPartials(path.join(__dirname,'/partials'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use('/',express.static(path.join(__dirname,'/public')))


app.get('/',(req,res)=>{
    console.log('in settings')
    if(req.user)
    {
        let {user}=req
        user={...user,password:"*********"}
        console.log("user is : ",user)
        res.render('userSettings',{user})    
    }
    else{
        res.redirect('/')
    }
    
})

module.exports=app