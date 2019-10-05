const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')

const  {get_alluserImgs,insert_userImgs,delete_userImg}=require('../database/imageCollection')
const  { get_allComments,insert_comment,delete_comment}=require('../database/imgCmtCollection')
const {get_imageLikes,add_imageLikes,remove_like}=require('../database/likesCollection')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
hbs.registerPartials(path.join(__dirname,'/partials'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use('/',express.static(path.join(__dirname,'/public')))

app.get('/',(req,res)=>{
    console.log('in wall get')
    if(req.user)
    {
        const viewingUser=req.user.username
        const {findinguser}=req.query
        const {userpic}=req.query
        const {userWall}=req.query
        const {wallpic}=req.query
        const {friends}=req.user
        let isFriend=false
        console.log('friends are ',friends)
        if(friends.find(ele=>ele===userWall)){
            isFriend=true    
        }
        //console.log('values taken :',findinguser,userpic,userWall,wallpic)    
        get_alluserImgs(userWall)
        .then(result=>{
            return result.images
        })
        .then(arr=>{    
            const imagesArr=arr.reverse()
            console.log('images acquired : ',imagesArr,isFriend)
            res.render('wall',{findinguser,userpic,imagesArr,wallpic,userWall,viewingUser,isFriend})
        })
    }
    else{res.redirect('/')}
})


app.get('/viewImage',(req,res)=>{
    console.log('in wall viewImage get')
    if(req.user)
    {
        const comments=[]
        const imageName=req.query.image
        const viewinguser=req.user.username
        const {userWall}=req.query
        const {description}=req.query
        var like,count
       // console.log('values taken :',imageName,viewinguser,userWall,description) 
       get_imageLikes(userWall,imageName)
       .then(res=>{//console.log('likes are : ',res);
            if(res!==null){
                count=res.likes.length
                console.log('liked by user : ',res.likes.find(ele=>ele===viewinguser,count))   
                if(res.likes.find(ele=>ele===viewinguser))
                    {
                        console.log('in if find')
                        like=true
                    }
            }    
            return get_allComments(userWall,imageName)})
        .then(comments=>{    
            console.log('likes is there : ',like)
            res.render('image',{imageName,viewinguser,userWall,comments,description,like,count})
        })
       
    }
    else{res.redirect('/')}
})

app.post('/viewImage',(req,res)=>{
    console.log('in view images comment')
    if(req.user)
    {
        const {comment}=req.body
        const {tagged}=req.body
        const imageName=req.body.imageName
        const commentingUser=req.user.username
        const username=req.body.userWall
       // console.log('values taken :',comment,tagged,imageName,commentingUser,username)    
        insert_comment(username,imageName,commentingUser,comment,tagged)
        .then(comments=>{    
           console.log('comments acquired added: ',comments)
            res.sendStatus(200)
        })
    }
    else{res.redirect('/')}  
})



app.post('/viewImage/like',(req,res)=>{
    console.log('in view images likes')
    if(req.user)
    {
        const {imageName}=req.body
        const {likedBy}=req.body
        let unlikedBy
        const username=req.body.imgUser
        console.log('values taken :',username,imageName,likedBy,unlikedBy)
        if(likedBy)
        {
            console.log('in if server')
            add_imageLikes(username,imageName,likedBy)
            .then(likes=>{    
                res.sendStatus(200)
            })
        }  
        else{
            const likedBy=req.body.unLikedBy
            console.log('in else server',likedBy)
            remove_like(username,imageName,likedBy)
            .then(likes=>{    
                res.sendStatus(200)
            })
        } 
    }
    else{res.redirect('/')}  
})


module.exports=app