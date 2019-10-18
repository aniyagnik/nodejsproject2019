const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const {insert_friendRequest,get_friendRequest,delete_friendRequest,add_friend,get_friends,delete_friend}=require('../database/friendsCollection')
const {change_userEmail}=require('../database/IdsCollection')
const {set_appLock}=require('../database/IdsCollection')
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
        user={...user,password:"*********" }
        res.render('userSettings',{user})    
    }
    else{
        res.redirect('/')
    }
    
})

app.post('/appLock',(req,res)=>{
    console.log('in post applock settings')
    if(req.user)
    {
        let limit
        const {lockTime}=req.body
        const {username}=req.user
        console.log("lockTime value is ",lockTime,typeof lockTime)
        let ar=lockTime.split(':')
        if(ar.length>1){
            limit=ar[0]*60*60+ar[1]*60
        }else{
            limit=ar[0]*60
        }
        limit=limit*1000
         set_appLock(username,limit)
        .then('/user/settings')
    }
    else{
        res.redirect('/')
    }
    
})

app.post('/changeEmail',(req,res)=>{
    console.log('in post change email')
    if(req.user)
    {
        const {username}=req.user
        const {password}=req.body
        const {newEmail}=req.body 
        check_loginAcc(username,password)
        .then(user=>{
            if(user==null){
                return res.send({message:"password don't match"})
            }
            else{
                return change_userEmail(username,newEmail)
            }
        })
        .then(doc=>{
            console.log('user email changes ',as)
            res.redirect('/mail/send?to='+newEmail)
        })
        .catch(err=>{
            console.log('error in changing the account in',err)
            return res.send({message:"unindentified error"})
        })
    }
    else{
        res.redirect('/')
    }
})
module.exports=app