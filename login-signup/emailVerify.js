var express=require('express');
var nodemailer = require("nodemailer");
const crypto = require('crypto');

var app=express();


const {add_newHash,verify_emailId}=require('../database/hashCollection.js')
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
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
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/send',(req,res)=>{
    console.log('in seding message to account')
    //const key = crypto.randomBytes(20).toString('hex');
    var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    const email=req.query.to
    var hash = mykey.update(email, 'utf8', 'hex')
    hash += mykey.final('hex');
    const link=`https://${req.get('host')}/mail/verify?id=${hash}`;
    const mailOptions={
        to : email,
        subject : "Please confirm your Email account",
        html : `Hello,<br> Please Click on the link to verify your email.<br><a href=${link}>Click here to verify</a>` 
    }
    console.log(link);
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
});

app.get('/verify',(req,res)=>{
    console.log('in account verification')
    console.log(req.protocol+":/"+req.get('host'));
    const hash=req.query.id
    if(req.protocol==="https")
    {
        console.log("value in verify : ",hash)
        verify_emailId(hash)
        .then(val=>{
            if(val)
            {
                console.log("email is verified");
                res.redirect('/')
            }
            else
            {
                res.redirect('/verificationFail');
            }
        })
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
    res.sendStatus(202)
});


module.exports=app