const express = require('express')
const app = express.Router()
const path=require('path')
const passport=require('./passport')
app.use(express.json())
const  {create_newUnactiveLoginAcc}=require('../database/newLoginsCollection')
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


function checkForm(form)
  {
    if(form.username == "") {
      alert("Error: Username cannot be blank!");
      form.username.focus();
      return false;
    }
    re = /^\w+$/;
    if(!re.test(form.username)) {
      alert("Error: Username must contain only letters, numbers and underscores!");
      form.username.focus();
      return false;
    }
    if(!form.email.includes("@gmail.com")) {
      alert("Error: email must contain @gmail.com!");
      form.email.focus();
      return false;
    }
    if(form.password != "" && form.password == form.Cpassword) {
      if(form.password.length < 6) {
        alert("Error: Password must contain at least six characters!");
        form.password.focus();
        return false;
      }
      if(form.password == form.username) {
        alert("Error: Password must be different from Username!");
        form.password.focus();
        return false;
      }
      re = /[0-9]/;
      if(!re.test(form.password)) {
        alert("Error: password must contain at least one number (0-9)!");
        form.password.focus();
        return false;
      }
      re = /[a-z]/;
      if(!re.test(form.password)) {
        alert("Error: password must contain at least one lowercase letter (a-z)!");
        form.password.focus();
        return false;
      }
      re = /[A-Z]/;
      if(!re.test(form.password)) {
        alert("Error: password must contain at least one uppercase letter (A-Z)!");
        form.password.focus();
        return false;
      }
    } else {
      alert("Error: Please check that you've entered and confirmed your password!");
      form.password.focus();
      return false;
    }
    return true;
}

app.post('/signup',(req,res)=>{
    const newAcc={
        email:req.body.email,
        username:req.body.username,
        password:req.body.password,
        createdOn:req.body.date,
    }
    const form={...newAcc,Cpassword:req.body.Cpassword}
    const val=checkForm(form)
    if(val){
      async function add(){
        const addedUser=await create_newUnactiveLoginAcc(newAcc)
        console.log("added user is : ",addedUser)
        if(!addedUser)
        {
          console.log('adduser is null')
          res.send("username or email already exist")
        }
        else{
          console.log('adduser is not null')
          res.redirect('/mail/send?to='+req.body.email)
        }
       }
       add()
    }
    else{
      res.send("error in login credentials")
    }
     
})


module.exports=app