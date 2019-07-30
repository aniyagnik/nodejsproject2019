const express = require('express')
const app = express.Router()
const path=require('path')
const passport=require('./passport')
const multer=require('multer')

let storage=multer.diskStorage({
  destination:function(req,res,cb){
    cb(null,path.join(__dirname,'..\\account\\uploads\\'))
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+file.originalname)
  }
}
)

const upload=multer({storage:storage})

const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,update_loginAcc,delete_loginAcc}=require('../databases/IdsDatabase')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'./public')))
app.use('/user',require('../account'))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/login.html'))
})

app.post('/login',passport.authenticate('local',{
    failureRedirect:'/error',
    successRedirect:'/user/dashboard'
}))

app.post('/signup',upload.single('image'),(req,res)=>{
    
   // console.log('images :: ',req.file)
    const newAcc={
        email:req.body.email,
        username:req.body.username,
        password:req.body.password,
        image:req.file.filename
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