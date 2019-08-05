const express = require('express')
const app = express()
const path=require('path')
const session=require('express-session')
const passport=require('./login-signup/passport')
app.use(express.urlencoded({extended: true}))


app.get('/error',(req,res)=>{
  message="haah ahhahaha ha"
  res.render('error.hbs',{message})
})

app.use('/user',express.static(path.join(__dirname,'account/uploads')))

app.use('/user/wall',express.static(path.join(__dirname,'account/uploads')))

app.use('/',express.static(path.join(__dirname,'login-signup/public')))

app.use(function (req,res,next){
  console.log('handling request : ',req.url);
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


app.use('/',require('./login-signup'))
app.use('/user',require('./account'))
app.listen(8080,()=>{console.log('listening at 8080')})