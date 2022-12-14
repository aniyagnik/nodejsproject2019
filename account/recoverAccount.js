const express = require('express')
const app = express()
const hbs=require('hbs')
var nodemailer = require("nodemailer");
const path=require('path')
const crypto = require('crypto');

app.use(express.urlencoded({extended: true}))
app.use(express.json())
hbs.registerPartials(path.join(__dirname,'/partials'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
const {change_activeStatus}=require('../database/IdsCollection.js')
const {add_newHash,verify_emailId}=require('../database/hashCollection.js')

var smtpTransport = nodemailer.createTransport({
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

app.get("/",(req,res)=>{
    console.log('in recovery get')
    res.sendFile(path.join(__dirname,'../public/email.html'))
})

app.post('/accountDetails',(req,res)=>{
    console.log('in recover Account')
    let {email}=req.body
    var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    var hash = mykey.update(email, 'utf8', 'hex')
    hash += mykey.final('hex');
    console.log('values ',email,hash)
    const link=`https://${req.get('host')}/mail/verify?id=${hash}`;
    const mailOptions={
        to : email,
        subject : "Please confirm your Email account",
        html : `<br> Please Click on the link to verify your email.<br><a href=${link}>Click here to verify</a>` 
    }
    add_newHash(hash)
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
            console.log("error in mailing : ",error);
            res.redirect("/failedInSending");
    }else{
            console.log("Message sent: " + response.message);
            res.redirect("/emailSent");
        }
    });
})

app.get('/verify',(req,res)=>{
    console.log('in account recovery')
    const hash=req.query.id
    console.log("email from where hash has come : ",email)
    if(req.protocol==="https")
    {
        
        console.log("value in verify : ",hash)
        verify_emailId(hash)
        .then(val=>{
            console.log("value for verification situation ",val)
            if(val){
                console.log("email is verified");
               return res.redirect('/')
            }
            else{
                return res.redirect('/verificationFail');
            }
        })
        .catch(err=>(console.log("error in verifying email in email verify",err)))
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
});




module.exports=app