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

const   {get_alluserImgs,insert_userImgs,delete_userImg}=require('../database/imageCollection')
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,change_userPass,delete_loginAcc,change_userProfilePic,change_onlineStatus,change_userWallPic}=require('../database/IdsCollection')
const { insert_friendRequest,add_friend,get_friendRequest,get_friends,delete_friendRequest}=require('../database/friendsCollection')
/**
 * PROFILE IMAGE STORING STARTS
 */

const s3 = new aws.S3({
    accessKeyId: 'AKIAZQPSWXJ4FWIWC3OW',
    secretAccessKey: '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',
    Bucket: 'uploadimagesnode',
    region:'ap-south-1'
});
/**
* Single Upload
*/
const imgUpload = multer({
storage: multerS3({
    s3: s3,
    bucket: 'uploadimagesnode',
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