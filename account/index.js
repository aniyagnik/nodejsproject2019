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
app.use('/',express.static(path.join(__dirname,'/uploads')))
app.use('/wall',require('./wallIndex.js'))

const   {get_alluserImgs,insert_userImgs,delete_userImg}=require('../database/imageCollection')
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,update_loginAcc,delete_loginAcc,}=require('../database/IdsCollection')

let storage=multer.diskStorage({
  destination:function(req,res,cb){
    cb(null,path.join(__dirname,'..\\account\\uploads\\'))
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+file.originalname)
  }
}
)


const upload=multer({storage:storage})

app.get('/dashboard',(req,res)=>{
    console.log('in dashboard',req.user)  
    
    if(req.user)
    {
        get_alluserImgs(req.user.username)
        .then(result=>{
            return result.images
        })
        .then(imagesArr=>{   
            const {username}=req.user
            const {image}=req.user
           // console.log('imagesArr : ',imagesArr)
            res.render('dashboard',{username,image,imagesArr})
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
       
       insert_userImgs(req.body.username,req.file.filename,req.body.description)
       .then(uImages=>{
           console.log('in .then of insert image')
           //console.log("images added : ",uImages)
             res.redirect('/user/dashboard')   
        })
    }
    else{
        res.redirect('/')
    }
   
})

// app.post('/dashboard',(req,res)=>{
//     console.log('in post dashboard')
//     if(myAcc.password===req.query.password)
//     {   const edit=true
//         console.log('passwords are matCHED')
//         res.send(200)
//     }
//     else{
//         res.sendStatus()
//     }
// })

app.post('/dashboard/search',(req,res)=>{
    console.log('in post dashboard search')
    if(req.user)
    {
       console.log('searching for and by:',req.body.searchUser,req.user.username)
       get_loginAcc(req.body.searchUser)
       .then(document=>{console.log("user found : ",document)
             if(document!==null)
             {
                res.redirect('/user/wall?findinguser='+req.user.username+'&userpic='+document.image+'&userWall='+req.body.searchUser) 
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

app.get('/chat',(req,res)=>{
    console.log('in chat get')
    if(req.user)
    {
        res.redirect('/user/chat')
    }
    else{
        res.redirect('/')
    }
    
})


app.get('/logout',(req,res)=>{
    console.log('in chat get')
    if(req.user)
    {
        req.session.destroy()
        res.redirect('/')
    }
    else{
        res.redirect('/')
    }
    
})

module.exports=app