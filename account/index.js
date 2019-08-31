const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const multer=require('multer')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

hbs.registerPartials(path.join(__dirname+'/partials'))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use('/',express.static(path.join(__dirname,'/uploads')))
app.use('/wall',require('./wallIndex.js'))

const   {get_alluserImgs,insert_userImgs,delete_userImg}=require('../database/imageCollection')
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,change_userPass,delete_loginAcc,change_userProfilePic,change_onlineStatus,change_userWallPic}=require('../database/IdsCollection')

let storage=multer.diskStorage({
  destination:function(req,res,cb){
    cb(null,path.join(__dirname,'../uploads/'))
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
        .catch(err=>console.log('error in getting collection images ',err))
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
      // console.log('image:',req.file,req.body.description)
       
       insert_userImgs(req.body.username,req.file.filename,req.body.description)
       .then(uImages=>{
           //console.log('in .then of insert image')
           //console.log("images added : ",uImages)
             res.redirect('/user/dashboard')   
        })
    }
    else{
        res.redirect('/')
    }
   
})

app.post('/dashboard',upload.single('profilePic'),(req,res)=>{
    console.log('in post dashboard')
    if(req.user)
    {
       //console.log('image:',req.file)
       change_userProfilePic(req.user.username,req.file.filename)
       .then(uImages=>{
         //  console.log('in .then of insert image')
             res.redirect('/user/dashboard')   
        })
    }
    else{
        res.redirect('/')
    }
})


app.post('/dashboard/edit',upload.single('wallPic'),(req,res)=>{
    console.log('in post dashboard')
    if(req.user)
    {
       console.log('image:',req.file)
       change_userWallPic(req.user.username,req.file.filename)
       .then(uImages=>{
           console.log('in .then of insert image')
             res.redirect('/user/dashboard')   
        })
    }
    else{
        res.redirect('/')
    }
})

app.post('/dashboard/search',(req,res)=>{
    console.log('in post dashboard search')
    if(req.user)
    {
       console.log('searching for and by:',req.body.searchUser,req.user.username)
       get_loginAcc(req.body.searchUser)
       .then(document=>{console.log("user found : ",document)
             if(document!==null)
             {
                res.redirect('/user/wall?findinguser='+req.user.username+'&userpic='+document.image+'&wallpic='+document.wallPic +'&userWall='+req.body.searchUser) 
             }  
             else{
                res.redirect('/not-found') 
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

app.get('/dashboard/search',(req,res)=>{
    console.log('in get dashboard search')
    if(req.user)
    {
       console.log('searching for and by:',req.query.searchUser,req.user.username)
       get_loginAcc(req.query.searchUser)
       .then(document=>{console.log("user found : ",document)
             if(document!==null)
             {
                res.redirect('/user/wall?findinguser='+req.user.username+'&userpic='+document.image+'&wallpic='+document.wallPic +'&userWall='+req.query.searchUser) 
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

app.post('/dashboard/deleteImage',(req,res)=>{
    console.log('in deleteImage')
    if(req.user)
    {
        const {image}=req.body
        console.log('iamge to delete : ',image)
        delete_userImg(req.user.username,image)
        .then(result=>{
           
            res.redirect('/user/dashboard')})
    }
    else{
        res.redirect('/access-denied')
    }
    
})

app.post('/dashboard/changePassword',(req,res)=>{
    console.log('in post change PASS')
    if(req.user)
    {
       if(req.body.newPass===req.body.cNewPass)
       {
            change_userPass(req.user.username,req.body.newPass,req.body.oldPass)
            .then(done=>{
                if(done===false)
                  res.redirect('/not-found')
                res.redirect('/user/dashboard')})
       }
       else{
           console.log("PASSWORDS DON'T MATHCH")
           res.redirect('/')
       }
    }
    else{
        res.redirect('/')
    }
})

app.get('/logout',(req,res)=>{
    console.log('in logout')
    if(req.user)
    {
        change_onlineStatus(req.user.username,false)
        req.session.destroy()
        res.redirect('/')
    }
    else{
        res.redirect('/')
    }
    
})

module.exports=app