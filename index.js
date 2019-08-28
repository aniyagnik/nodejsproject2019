const express = require('express')
const app = express()
const path=require('path')
const session=require('express-session')
const passport=require('./login-signup/passport')
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.urlencoded({extended: true}))


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

app.use(session({
    secret: 'somethings are hidden for good',
    resave:false,
    saveUninitialized:true
  })
)

app.use(passport.initialize())   //tells express app to use passport
app.use(passport.session())     //tells express to user sessions with passport

app.use('/user/chat',require('./account/chat_app')(io))
app.use('/',require('./login-signup'))
app.use('/user',require('./account'))
http.listen(8080,()=>{console.log('listening at 8080')})