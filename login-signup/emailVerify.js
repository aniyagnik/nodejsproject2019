var express=require('express');
var nodemailer = require("nodemailer");
const crypto = require('crypto');

var app=express();

const {insert_loginAcc}=require('../database/IdsCollection.js')
const {add_newHash,verify_emailId}=require('../database/hashCollection.js')
const {get_newUnactiveAccount,remove_newAccount}=require('../database/newLoginsCollection')
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
        html : `<br> Please Click on the link to verify your email.<br><a href=${link}>Click here to verify</a>` 
    }
    add_newHash(email)
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
            console.log("error in mailing : ",error);
            res.send("failed in sending verification mail to provided email address. try again.")
    }else{
            console.log("Message sent ");
            res.send("a mail was send to your email address for verifiaction. Verify it to proceed.")
        }
    });
});

app.get('/verify',(req,res)=>{
    console.log('in account verification')
    const hash=req.query.id
    var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    let email = mykey.update(hash, 'hex', 'utf8')
    email += mykey.final('utf8');
    console.log("email to be made active : ",email)
    if(req.protocol==="https")
    {
        console.log("value in verify : ",hash)
        verify_emailId(email)
        .then(val=>{
            console.log("value for verification situation ",val)
            if(val){
                async function addAccount(){
                    let k=await get_newUnactiveAccount(email)
                        .then(doc=>{
                            if(doc){
                                console.log("account exists in unactive accounts")
                                remove_newAccount(email)
                                return insert_loginAcc(doc)
                            }
                            else{
                                console.log("account does not exist in unactive accounts")
                                return 
                            }
                        })
                        .then(addedUser=>{
                            if(typeof addedUser!=='undefined')
                            {
                                console.log('adduser is not null')
                                res.redirect('/')
                            }
                            else{
                                console.log('adduser is null')
                                res.redirect('/access-denied')
                            }
                        })
                        .catch(err=>{console.log("error has occured while adding user ",err);res.redirect('/access-denied')})
                }
                addAccount()
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