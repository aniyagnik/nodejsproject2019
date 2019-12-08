const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
var nodemailer = require("nodemailer");
const {change_userEmail,check_loginAcc,check_userEmail,change_activeStatus,change_userPass}=require('../database/IdsCollection')
const {set_appLock}=require('../database/IdsCollection')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
hbs.registerPartials(path.join(__dirname,'/partials'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use('/',express.static(path.join(__dirname,'/public')))

const smtpTransport = nodemailer.createTransport({
    secure:false,
    service: "Gmail",
    auth: {
        user: "aniyagnik1@gmail.com",
        pass: "aniyagnik#Qsh"
    },
    tls:{
    rejectUnauthorized:false
    },
    ssl:true
});

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
        async function k(){
        let a,b,c,message    
            a= await check_loginAcc(username,password)
                    .then(as=>{
                        if(as==null){
                            message="password don't match"
                            console.log(message)
                            return false
                        }
                        else{
                            console.log("right pass")
                            return true
                        }
                    })
            if(a){
                b=await check_userEmail(newEmail)
                    .then(val=>{
                        if(val){
                            message="email already exists"
                            console.log(message)
                            return false
                        }
                        else{console.log("email is no")
                            return true 
                        }
                    })
                if(b){
                    c=await change_userEmail(username,newEmail)
                        .then(doc=>{
                            if(doc){
                                console.log('user email changes ',doc.result)
                                res.redirect('/mail/send?to='+newEmail)
                                return true
                            }
                            else{message="error ";return false}
                        })
                        .then(asd=>{
                            if(asd){
                                return change_activeStatus(email,false)
                            }

                        })
                        .catch(err=>{
                            console.log('error in changing the account in',err)
                            message="unindentified error"
                        })
                }    
            }
            return res.send({message:message})
        }
        k()
    }
    else{
        res.redirect('/')
    }
})
 
function checkPass(password){
    if(password != "" && password == Cpassword) {
        if(password.length < 7) {
          return false;
        }
        if(password == username) {
          return false;
        }
        re = /[0-9]/;
        if(!re.test(password)) {
          return false;
        }
        re = /[a-z]/;
        if(!re.test(password)) {
          return false;
        }
        re = /[A-Z]/;
        if(!re.test(password)) {
          return false;
        }
      } else 
          return false;
}
app.post('/changePassword',(req,res)=>{
    console.log('in post change PASS')
    if(req.user){
        console.log("value got : ",req.body)
        if(req.body.newPass===req.body.cNewPass){ 
            if(checkPass(req.body.newPass)){
                change_userPass(req.user.username,req.body.newPass,req.body.oldPass)
                .then(done=>{
                    if(done===false)
                        res.send('unable to change password')
                    res.send('password changed succesfully')})
            }
            else{
                res.send("password is not strong")
            }
       }
       else{
           res.send("PASSWORDS DON'T MATHCH")
       }
    }
    else{
        res.redirect('/')
    }
})


app.post('/query',(req,res)=>{
    console.log('in sending mail for query')
    if(req.user)
    {
        const {username}=req.user
        const {body}=req.body
        const  {subject}=req.body
        subject=`${username}<br>${subject}`
        const mailOptions={
            to : "webshare.query@gmail.com",
            subject : subject,
            html : body
        }
        smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
                console.log("error in mailing : ",error);
                res.send("error while sending mail. try again");
        }else{
                console.log("Message sent ");
                res.send("email sent successfully");
            }
        });

    }
    else{
        res.redirect('/')
    }
})

module.exports=app