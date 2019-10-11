const express = require('express')
const app = express.Router()
const path=require('path')
const passport=require('./passport')
const multer=require('multer')

let storage=multer.diskStorage({
  destination:function(req,res,cb){
    cb(null,path.join(__dirname,'..\\uploads\\'))
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+file.originalname)
  }
}
)

const upload=multer({storage:storage})
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,update_loginAcc,delete_loginAcc}=require('../database/IdsCollection')
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'./public')))
app.use('/user',require('../account'))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/login.html'))
})

app.post('/login',passport.authenticate('local',{
    failureRedirect:'/not-found',
    successRedirect:'/user/dashboard'
}))

app.post('/signup',(req,res)=>{
    const newAcc={
        email:req.body.email,
        username:req.body.username,
        password:req.body.password,
        createdOn:req.body.date,
    }
    async function add(){
      const addedUser=await insert_loginAcc(newAcc)
      if(addedUser==undefined)
      {
        console.log('adduser is null')
        res.redirect('/access-denied')
      }
      else{
        console.log('adduser is not null')
        res.redirect('/mail/send?to='+req.body.email)
        //res.redirect('/')
      }
     }
     add()
})


module.exports=app