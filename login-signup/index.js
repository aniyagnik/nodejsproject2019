const express = require('express')
const app = express.Router()
const path=require('path')
const passport=require('./passport')
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,delete_loginAcc}=require('../databases/IdsDatabase')
app.use(express.urlencoded({extended: true}))

app.use('/user',require('../account'))

app.use(express.static(path.join(__dirname,'/public')))


app.get('/ids',(req,res)=>{
    get_allLogins()
    .then(allLogins => { 
        console.log(allLogins)
        res.render(path.join(__dirname, 'allLogins.hbs'),{allLogins})
      })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/login.html'))
})

app.post('/login',passport.authenticate('local',{
    failureRedirect:'/error',
    successRedirect:'/user/dashboard'
}))

app.post('/signup',(req,res)=>{
    const newAcc={
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    }
    const addedUser=insert_loginAcc(newAcc)
    if(addedUser==null)
    {res.redirect('/error')}
    else{res.redirect('/user/dashboard')}
})

app.get('/error',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/error.html'))
})

module.exports=app