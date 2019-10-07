const express = require('express')
const app = express()
const path=require('path')
const session=require('express-session')
const passport=require('./login-signup/passport')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var nodemailer = require("nodemailer");


/*S3_BUCKET = process.env.S3_BUCKET || 'anirudhbucketnodejs19';
aws.config.region = 'ap-south-1';
AWSAccessKeyId=AKIAJ7IGPAB26GURJG4A;
AWSSecretKey=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
*/
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({extended: true}))
app.use('/error',express.static(path.join(__dirname,'error pages')))
app.use('/user/friends',express.static(path.join(__dirname,'account/public')))
app.use('/user/image',express.static(path.join(__dirname,'public')))
app.use('/user/wall',express.static(path.join(__dirname,'account/public')))
app.use('/user/chat',express.static(path.join(__dirname,'account/chat_app/public')))
app.use('/user',express.static(path.join(__dirname,'account/public')))
app.use('/',express.static(path.join(__dirname,'login-signup/public')))

app.use(function (req,res,next){
  console.log('handling request : ',req.url+" with method "+req.method);
  next();
})


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

app.get('/access-denied',(req,res)=>{
  res.sendFile(path.join(__dirname,'error pages/403.html'))
})


app.get('/not-found',(req,res)=>{
  res.sendFile(path.join(__dirname,'error pages/404.html'))
})

app.use(session({
    secret: "somethings are hidden for good",
    resave:false,
    saveUninitialized:true
  })
)

app.use(passport.initialize())   //tells express app to use passport
app.use(passport.session())     //tells express to user sessions with passport


app.use('/user/chat',require('./account/chat_app')(io))
app.use('/user',require('./account'))

app.use('/',require('./login-signup'))
var port =  process.env.PORT ||8080;
http.listen(port,()=>{console.log('listening at ',port)})