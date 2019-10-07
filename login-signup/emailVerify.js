var express=require('express');
var nodemailer = require("nodemailer");

var app=express();


const {add_newHash,remove_hash,verify_emailId}=require('./database/hashCollection.js')
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
    secure:false,
    service: "Gmail",
    auth: {
        user: "aniyagnik1@gmail.com",
        pass: "@niYagnik#0"
    },
    tls:{
      rejectUnauthorized:false
    }
});
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/send',(req,res)=>{
    console.log('in seding message to account')
    const rand=Math.floor((Math.random() * 100) + 54);
    const host=req.get('host');
    const link="http://"+req.get('host')+"/verify?id="+rand;
    const mailOptions={
        to : req.query.to,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
            console.log("error in mailing : ",error);
        res.end("error");
    }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
        }
    });
});

app.get('/verify',(req,res)=>{
    console.log('in account verification')
    console.log(req.protocol+":/"+req.get('host'));
    const host=req.get('host');
    // if((req.protocol+"://"+req.get('host'))==("http://"+host))
    // {
    //     console.log("Domain is matched. Information is from Authentic email");
    //     verify_emailId()
    //     if(req.query.id==rand)
    //     {
    //         console.log("email is verified");
    //         res.end("<h1>Email is been Successfully verified");
    //     }
    //     else
    //     {
    //         console.log("email is not verified");
    //         res.end("<h1>Bad Request</h1>");
    //     }
    // }
    // else
    // {
    //     res.end("<h1>Request is from unknown source");
    // }
    res.send("202")
});


module.exports=app