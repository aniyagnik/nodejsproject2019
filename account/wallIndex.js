const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')

const  {get_alluserImgs,insert_userImgs,delete_userImg}=require('../database/imageCollection')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
hbs.registerPartials(path.join(__dirname+'/partials'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use('/',express.static(path.join(__dirname,'/uploads')))

app.get('/',(req,res)=>{
    console.log('in wall get')
    if(req.user)
    {
        const {findinguser}=req.query
        const {userpic}=req.query  
        const {userWall}=req.query
        console.log('values taken :',findinguser,userpic,userWall)    
        get_alluserImgs(userWall)
        .then(result=>{
            return result.images
        })
        .then(imagesArr=>{    
            console.log('images acquired : ',imagesArr)
            res.render('wall',{findinguser,userpic,imagesArr,userWall})
        })
    }
    else{res.redirect('/')}
})


app.get('/viewImage',(req,res)=>{
    console.log('in wall viewImage')
    if(req.user)
    {
        const comments=[]
        const showimage=req.query.image
        const viewinguser=req.user.username
        const {userWall}=req.query
        const {description}=req.query
        console.log('values taken :',showimage,viewinguser,userWall,description)    
        // get_alluserImgComment(image,userWall)
        // .then(comments=>{    
        //     console.log('comments acquired : ',comments)
        //     res.render('wall',{image,userWall,comments})
        // })
        res.render('image',{showimage,viewinguser,userWall,comments,description})
    }
    else{res.redirect('/')}
})

app.post('/viewImage',(req,res)=>{
    console.log('in view images comment')
    if(req.user)
    {
        const {comment}=req.body
        const {imageName}=req.body
        const commentinguser=req.user.username
        const {userWall}=req.body
        console.log('values taken :',comment,imageName,commentinguser,userWall)    
        // get_alluserImgComment(image,userWall)
        // .then(comments=>{    
        //     console.log('comments acquired : ',comments)
        //     res.render('wall',{image,userWall,comments})
        // })
        res.render('image',{comments,imageName,commentinguser,userWall})
    }
    else{res.redirect('/')}  
})


module.exports=app