const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')

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

app.post('/friend req',(req,res)=>{
    console.log('in friend request')
    if(req.user){
        const reqSender=req.user.username
        const username=req.body.user
        console.log('values are : ',username,reqSender)
        insert_friendRequest(username,reqSender)
    }else{
        res.redirect('/')
    }
})

app.get('addFriend',(req,res)=>{
    console.log('in friend request post add')
    if(req.user){
        const {username}=req.user
        const requester=req.query.friend
        console.log('friend req of : ',requester)
        add_friend(username,requester)
        .then(doc=>delete_friendRequest(username,requester))
        .then(ha=>res.redirect('/user/dashboard'))
    }else{
        res.redirect('/')
    }
})

app.post('remove friendreq',(req,res)=>{
    console.log('in friend request remove')
    if(req.user){
        reqSender=req.body.viewingUser
        delete_friendRequest(username,reqSender)
    }else{
        res.redirect('/')
    }
})


module.exports=app