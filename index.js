const express = require('express')
const app = express()
const path=require('path')
const session=require('express-session')
const passport=require('./login-signup/passport')
var http = require('http');
var fs    = require('fs');
var httpOptions =  {
  key: fs.readFileSync("keys/privatekey.pem"),
  cert: fs.readFileSync("keys/certificate.pem")
 }
var server = http.createServer(app);
var io = require('socket.io')(server);

const  {change_onlineStatus,get_todayTime,change_onlineTime}=require('./database/IdsCollection')

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
app.use('/user/settings',express.static(path.join(__dirname,'account/public')))
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

app.get('/verificationFail',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/verificationFail.html'))
})


app.get('/emailSent',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/emailSent.html'))
})


app.get('/failedInSending',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/failedInSending.html'))
})
app.get('/removeSession',(req,res)=>{
  const newAr=ids.filter(ele=>{
      if(ele.name!==req.query.user){
          ele={...ele,name:ele.name}
          return ele
        }
  })
  ids=newAr
  res.redirect('/')
})



let ids=[]
var rNum=Math.random()/4294967295
app.get('/heartbeat',(req,res)=>{
    console.log('in heart beat server')
    const {name}=req.query
    const index=ids.findIndex(ele=>ele.name===name)
    if(index>-1)
    {
       ids[index].value=rNum
    }
    else{
      get_todayTime(name)
      .then(time=>{
        const sessionInfo={
          name:name,
          value:rNum,
          loginTime:time
      }
      ids.push(sessionInfo)
      })
    }
   
    res.sendStatus(202)
})
setInterval(removeOfflined,100000)
    
function removeOfflined () {
    if(typeof ids[0]!=="undefined")
    {
        let oldVal=rNum
        console.log("arrays : ",typeof ids,typeof ids[0])
        console.log("array to be checked : ",ids)
        rNum=Math.random()/4294 //967295
        console.log('old and new : ',oldVal,rNum)
        const newAr=ids.filter(ele=>{
            if(ele.value===oldVal){
                ele={...ele,name:ele.name}
                return ele
            }
            else{
              const d=new Date()
              change_onlineStatus(ele.name,false)
              .then(as=>{
                let time=d-ele.loginTime
                console.log("we are logging out with time : ",time,typeof time)
                change_onlineTime(ele.name,time)})
             }
        })
        ids=newAr
        console.log('new array : ',ids,typeof ids)
    }
    else{
        return
    }
    
}
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
app.use('/mail',require('./login-signup/emailVerify'))
app.use('/',require('./login-signup'))
var port =  process.env.PORT ||8080;
server.listen(port,()=>{console.log('listening at ',port)})