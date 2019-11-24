const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const multer=require('multer')
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
app.use(express.urlencoded({extended: true}))
app.use(express.json())

hbs.registerPartials(path.join(__dirname+'/partials'))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use('/',express.static(path.join(__dirname,'/uploads')))
app.use('/wall',require('./wallIndex.js'))
app.use('/friends',require('./friendIndex.js'))
app.use('/settings',require('./settingIndex.js'))
app.use('/recovery',require('./recoverAccount.js'))

const   {get_alluserImgs,insert_userImgs,delete_userImg}=require('../database/imageCollection')
const  {check_loginAcc,get_loginAcc,get_userTotalTime,get_userTime,delete_loginAcc,change_userProfilePic,change_onlineStatus,change_userWallPic,change_onlineTime}=require('../database/IdsCollection')
/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
    accessKeyId: awsKey,
    secretAccessKey: secret,
    Bucket: 'uploadimagesnodejs'
});
/**
* Single Upload
*/
const imgUpload = multer({
storage: multerS3({
    s3: s3,
    bucket: 'uploadimagesnodejs',
    acl: 'public-read',
    key: function (req, file, cb) {
    cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
}),
limits:{ fileSize: 3000000 }, // In bytes: 3000000 bytes = 3 MB
fileFilter: function( req, file, cb ){
    checkFileType( file, cb );
    console.log('exit checkFileType')
}
})

/**
* Check File Type
* @param file
* @param cb
* @return {*}
*/
function checkFileType( file, cb ){
    console.log('in checkFileType')
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
    if( mimetype && extname ){
        return cb( null, true );
    } else {
        cb( 'Error: Images Only!' );
    }
}

app.get('/dashboard',(req,res)=>{
    console.log('in dashboard')  
    if(req.user)
    {
        let requests,{username}=req.user
        console.log('check typeof ',typeof req.user.totalTime,typeof req.user.todayTime)
        get_alluserImgs(username)
        .then(result=>{
            return result.images
        })
        .catch(err=>console.log('error in getting collection images ',err))
        .then(arr=>{   
            const {username}=req.user
            const {image}=req.user
            const imagesArr=arr.reverse()
            //console.log('imagesArr : ',imagesArr)
            res.render('dashboard',{username,image,imagesArr,requests})
        })
    }
    else{
        res.redirect('/')
    }
   
})

app.get('/getUserTime',(req,res)=>{
    if(req.user){
        
        get_userTime(req.user.username)
        .then(limit=>res.send(limit))
    }
    else{
        res.redirect("/")
    }
})



app.get('/totalTime',(req,res)=>{
    if(req.user){
        
        get_userTotalTime(req.user.username)
        .then(limit=>res.send(limit))
    }
    else{
        res.redirect("/")
    }
})
app.post('/dashboard/addImage',imgUpload.single('uImages'),(req,res)=>{
    console.log('in addImage')   
    if(req.user)
    {
      // console.log('image:',req.file,req.body.description)
       
       insert_userImgs(req.body.username,req.file.location,req.body.description)
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

app.post('/dashboard',imgUpload.single('uploadImage'),(req,res)=>{
    console.log('in post dashboard')
    if(req.user)
    {
       //console.log('image:',req.file)
       change_userProfilePic(req.user.username,req.file.location)
       .then(uImages=>{
         //  console.log('in .then of insert image')
             res.redirect('/user/dashboard')   
        })
    }
    else{
        res.redirect('/')
    }
})


app.post('/dashboard/edit',imgUpload.single('wallPic'),(req,res)=>{
    console.log('in post dashboard')
    if(req.user)
    {
       //console.log('image:',req.file)
       change_userWallPic(req.user.username,req.file.location)
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




app.get('/logout',(req,res)=>{
    console.log('in logout')
    if(req.user)
    {
        let {time}=req.query
        time=parseInt(time)
        console.log("we are logging out with time : ",time,typeof time)
        const {username}=req.user
        change_onlineStatus(username,false)
        .then(as=>change_onlineTime(username,time))
        req.session.destroy()
        res.redirect('/removeSession?user='+req.user.username)
    }
    else{
        res.redirect('/')
    }  
})

app.post('/deleteAccount',(req,res)=>{
    console.log("in delete account")
    if(req.user){
        const {password}=req.body
        const {username}=req.user
        console.log("values : ",password)
        check_loginAcc(username,password)
        .then(user=>{
            if(user==null)
            {return res.send({message:"password didn't matched"})}
            else{
             return delete_loginAcc(username)   
            }
        })
        .then(wer=>{console.log("user account deleted succesfully...")
            return res.send({message:"email removed succesfully"})
        })
        .catch(err=>{
            console.log('error in finding the account in localStratergy',err)
            return done(null,false,{message:'no such user'})
        })
    }
})

module.exports=app