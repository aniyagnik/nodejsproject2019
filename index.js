const express = require('express')
const app = express()
const path=require('path')
const session=require('express-session')
const passport=require('./login-signup/passport')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const aws = require('aws-sdk');


/*S3_BUCKET = process.env.S3_BUCKET || 'anirudhbucketnodejs19';
aws.config.region = 'ap-south-1';
AWSAccessKeyId=AKIAJ7IGPAB26GURJG4A;
AWSSecretKey=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
*/
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({extended: true}))

app.use('/user/image',express.static(path.join(__dirname,'public')))
app.use('/user/wall',express.static(path.join(__dirname,'account/public')))
app.use('/user/chat',express.static(path.join(__dirname,'account/chat_app/public')))
app.use('/user',express.static(path.join(__dirname,'account/public')))
app.use('/',express.static(path.join(__dirname,'login-signup/public')))

app.use(function (req,res,next){
  console.log('handling request : ',req.url+" with method "+req.method);
  next();
})

app.get('/access-denied',(req,res)=>{
  res.sendFile(path.join(__dirname,'error pages/403.html'))
})


app.get('/not-found',(req,res)=>{
  res.sendFile(path.join(__dirname,'error pages/404.html'))
})

var secretVal
app.use(session({
    secret: secretVal,
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