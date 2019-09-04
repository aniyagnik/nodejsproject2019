const express = require('express')
const app = express()
const path=require('path')
const session=require('express-session')
const passport=require('./login-signup/passport')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const aws = require('aws-sdk');


S3_BUCKET = process.env.S3_BUCKET || 'anirudhbucketnodejs19';
aws.config.region = 'ap-south-1';
AWSAccessKeyId=AKIAJ7IGPAB26GURJG4A;
AWSSecretKey=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

aws.config.region='ap-south-1'
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({extended: true}))

var S3_BUCKET
app.use('/access-denied',express.static(path.join(__dirname,'error pages')))

app.use('/not-found',express.static(path.join(__dirname,'error pages')))

app.get('/access-denied',(req,res)=>{
  res.sendFile(path.join(__dirname,'error pages/403.html'))
})


app.get('/not-found',(req,res)=>{
  res.sendFile(path.join(__dirname,'error pages/404.html'))
})

app.use('/user/uploads',express.static(path.join(__dirname,'uploads')))

app.use('/user/chat',express.static(path.join(__dirname,'account/chat_app/public')))

app.use('/user',express.static(path.join(__dirname,'account/public')))

app.use('/',express.static(path.join(__dirname,'login-signup/public')))

app.use(function (req,res,next){
  console.log('handling request : ',req.url+" with method "+req.method);
  next();
})
var secretVal="somethings are hidden for good"
app.use(session({
    secret: secretVal,
    resave:false,
    saveUninitialized:true
  })
)

app.use(passport.initialize())   //tells express app to use passport
app.use(passport.session())     //tells express to user sessions with passport


app.get('/sign-s3', (req, res) => {
  console.log('in sign-s3 get')
 
  const fileName = Date.now()+req.query['file-name'];
  const fileType = req.query['file-type'];
  console.log('filename is : ',fileName)
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  const s3 = new aws.S3();
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.use('/user/chat',require('./account/chat_app')(io))
app.use('/',require('./login-signup'))
app.use('/user',require('./account'))

// use port 8080 unless there exists a preconfigured port
var port = process.env.PORT || 8080;
http.listen(port,()=>{console.log('listening at 8080')})