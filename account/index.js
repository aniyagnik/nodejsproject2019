const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const multer=require('multer')
const   {get_alluserImgs,insert_userImgs,delete_userImg}=require('../databases/imageDatabase')
let storage=multer.diskStorage({
  destination:function(req,res,cb){
    cb(null,path.join(__dirname,'..\\account\\uploads\\'))
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+file.originalname)
  }
}
)
let images=[]
const upload=multer({storage:storage})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
hbs.registerPartials(path.join(__dirname+'/partials'))

app.use('/chat',require('./chat_app'))
app.set('view engine', 'hbs')
let myAcc=[]
app.set('views', path.join(__dirname, '/views'));


app.use(express.static(path.join(__dirname,'/uploads')))

app.get('/dashboard',(req,res)=>{
    console.log('in dashboard',req.user,images)  
   
    myAcc=req.user 
    if(req.user)
    {
        get_alluserImgs(req.user.username)
        .then(result=>{
            return result.images
        })
        .then(imagesArr=>{
            images=imagesArr    
            const user=req.user
            res.render('dashboard',{user,images})
        })
    }
    else{
        res.redirect('/')
    }
   
})

app.post('/dashboard/addImage',upload.single('Uimages'),(req,res)=>{
    console.log('in addImage')   
    if(req.user)
    {
       console.log('image:',req.file)
       let image=req.file.filename
       insert_userImgs(myAcc.username,image)
       .then(uImages=>{console.log("images added : ",uImages)
            images=uImages
             res.redirect('/user/dashboard')   
    })
    }
    else{
        res.redirect('/')
    }
   
})

app.post('/dashboard',(req,res)=>{
    console.log('in post dashboard')
    if(myAcc.password===req.query.password)
    {   const edit=true
        console.log('passwords are matCHED')
        res.send(200)
    }
    else{
        res.sendStatus()
    }
})

app.get('/chat',(req,res)=>{
    const {username}=req.query
    res.redirect('/user/chat')
})

module.exports=app