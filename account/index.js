const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const multer=require('multer')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
hbs.registerPartials(path.join(__dirname+'/partials'))
app.use('/chat',require('./chat_app'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname,'/uploads')))

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
let myAcc=[]
var images=null
const upload=multer({storage:storage})
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,update_loginAcc,delete_loginAcc}=require('../databases/IdsDatabase')

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
            console.log('images acquired : ',imagesArr)
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
       console.log('image:',req.file,req.body.description)
       
       insert_userImgs(myAcc.username,req.file.filename,req.body.description)
       .then(uImages=>{
           console.log('in .then of insert image')
           console.log("images added : ",uImages)
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

app.post('/dashboard/search',(req,res)=>{
    console.log('in post dashboard search')
    if(req.user)
    {
       console.log('searching for:',req.body.searchUser)
       get_loginAcc(req.body.searchUser)
       .then(document=>{console.log("user found : ",document)
             if(document!==null)
             {
                res.redirect('/user/wall?finduser='+req.body.searchUser+'&userpic='+document.image) 
             }  
             else{
                res.redirect('/user/dashboard?return=no-such-user') 
             }
       })
       .catch(err=>{
           console.log('error occured : ',err)
           res.redirect('/user/dashboard')
       })
    }
    else{
        res.redirect('/')
    }
})
app.get('/wall',(req,res)=>{
    if(req.user)
    {
        const {finduser}=req.query
        const {userpic}=req.query
        get_alluserImgs(finduser)
        .then(result=>{
            return result.images
        })
        .then(imagesArr=>{
            images=imagesArr    
            res.render('wall',{userpic,images})
        })
        
    }
})
app.get('/chat',(req,res)=>{
    const {username}=req.query
    res.redirect('/user/chat')
})

module.exports=app