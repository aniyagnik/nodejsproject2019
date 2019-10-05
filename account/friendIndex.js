const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const {delete_loginFriend}=require('../database/IdsCollection')
const {insert_friendRequest,get_friendRequest,delete_friendRequest,add_friend,get_friends,delete_friend}=require('../database/friendsCollection')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
hbs.registerPartials(path.join(__dirname,'/partials'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use('/',express.static(path.join(__dirname,'/public')))

app.get('/',(req,res)=>{
    console.log('in friends view get')
    if(req.user){
        const {username}=req.user
        let requests
        get_friendRequest(username)
       .then(doc=>{requests=doc
            return get_friends(username)
        })
        .then(friends=>{
            friendsList=friends
            res.render('friends',{requests,friendsList})
        })
    }
    else{
        res.redirect('/')
    }

})

app.post('/friendReq',(req,res)=>{
    console.log('in friend request')
    if(req.user){
        const reqSender=req.user.username
        const username=req.body.user
        console.log('values are : ',username,reqSender)
        insert_friendRequest(username,reqSender)
        .then(ha=>res.sendStatus(202))
    }else{
        res.redirect('/')
    }
})

app.get('/addFriend',(req,res)=>{
    console.log('in friend request post add')
    if(req.user){
        const {username}=req.user
        const requester=req.query.friend
        console.log('friend req of : ',requester)
        add_friend(username,requester)
        .then(doc=>add_friend(requester,username))
        .then(doc=>delete_friendRequest(username,requester))
        .then(ha=>res.redirect('/user/friends'))
    }else{
        res.redirect('/')
    }
})


app.post('/removeFriend',(req,res)=>{
    console.log('in friend request post remove')
    if(req.user){
        const {username}=req.user
        const requester=req.body.user
        console.log('friend req of : ',requester)
        delete_friend(username,requester)
        .then(doc=>delete_friend(requester,username))
        .then(doc=>delete_loginFriend(username,requester))
        .then(doc=>delete_loginFriend(requester,username))
        .then(ha=>res.sendStatus(202))
        .catch(err=>console.log('error in deleting friend',err))
    }else{
        res.redirect('/')
    }
})

app.post('/removeFriendRequest',(req,res)=>{
    console.log('in friend request remove')
    if(req.user){
        reqSender=req.body.viewingUser
        const {username}=req.user
        delete_friendRequest(username,reqSender)
        .then(ha=>res.sendStatus(202))
        .catch(err=>console.log('error in deleting friend request' ,err))

    }else{
        res.redirect('/')
    }
})


module.exports=app