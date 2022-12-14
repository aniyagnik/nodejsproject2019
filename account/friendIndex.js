const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const {delete_loginFriend}=require('../database/IdsCollection')
const {insert_recievedfriendRequest,get_recievedfriendRequest,delete_recievedfriendRequest,insert_sendfriendRequest,get_sendfriendRequest,
    delete_sendfriendRequest,insert_friendInList,get_friendsInList,delete_friendInList,get_profilePic}=require('../database/friendsCollection')
const {create_newGroup}=require("../database/groupCollection")
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
        let requests,friendsList,promises1=[],promises2=[],promises3=[]
        get_recievedfriendRequest(username)
       .then(doc=>{
           if(doc.length>0){
                console.log('requesters name are : ',doc)
                doc.forEach(ele=>{
                    promises1.push(get_profilePic(ele))
                })
                return Promise.all(promises1)
           }
           else{
               return null
           }
        })
        .then(list=>{
            console.log("list for recieved requesters ",list)
            requestsRec=list
            return get_sendfriendRequest(username)
        })
        .then(doc=>{
            if(doc.length>0){    
                console.log('friends name are : ',doc)
                doc.forEach(ele=>{
                    promises3.push(get_profilePic(ele))
                })
                return Promise.all(promises3)
           }
           else{
               return null
           }
        })
        .then(list=>{
            console.log("list for send requesters ",list)
            requestsSend=list
            return get_friendsInList(username)
        })
        .then(doc=>{
            if(doc.length>0){    
                console.log('friends name are : ',doc)
                doc.forEach(ele=>{
                    promises2.push(get_profilePic(ele))
                })
                return Promise.all(promises2)
           }
           else{
               return null
           }
        })
        .then(list=>{
            console.log("list for friends ",list)
            friendsList=list
            res.render('friends',{requestsSend,requestsRec,requests,friendsList,username})
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
        insert_recievedfriendRequest(username,reqSender)
        .catch(err=>console.log('error while saving sendrequest ',err))
        .then(as=>insert_sendfriendRequest(reqSender,username))
        .catch(err=>console.log('error while saving recieved request ',err))
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
        insert_friendInList(username,requester)
        .then(doc=>delete_recievedfriendRequest(username,requester))
        .then(doc=>insert_friendInList(requester,username))
        .then(doc=>delete_sendfriendRequest(requester,username))
        .catch(err=>console.log("error in making friend ",err))
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
        delete_friendInList(username,requester)
        .then(doc=>delete_friendInList(requester,username))
        .then(ha=>res.sendStatus(202))
        .catch(err=>console.log('error in deleting friend',err))
    }else{
        res.redirect('/')
    }
})

app.post('/removeFriendRequest',(req,res)=>{
    console.log('in friend request remove')
    if(req.user){
        const {reciever}=req.body
        const {sender}=req.body
        console.log('req body is ',req.body)
        console.log('values in removing sender reciever ',sender,reciever)
        delete_recievedfriendRequest(reciever,sender)
        .then(dd=>delete_sendfriendRequest(sender,reciever))
        .then(ha=>res.sendStatus(202))
        .catch(err=>console.log('error in deleting friend request' ,err))

    }else{
        res.redirect('/')
    }
})


app.post('/unFriendSelected',(req,res)=>{
    console.log('in friend request post selected remove')
    if(req.user){
        const {username}=req.user
        let promises4=[]
        console.log('friend : ',typeof req.body,req.body.selectedFriend)
        const selectedFriend=req.body.selectedFriend.split(" ")
        console.log('unfriend list',selectedFriend)
        selectedFriend.forEach(requester=>{
            promises3.push(delete_friendInList(username,requester),delete_friendInList(requester,username))
        })
        Promise.all(promises4)
        .then(ha=>res.redirect('/user/friends'))
        .catch(err=>console.log('error in deleting friend',err))

    }else{
        res.redirect('/')
    }
})

app.post('/createGroup',(req,res)=>{
    if(req.user){
        const {username}=req.user
        const {groupName}=req.body
        const selectedFriend=req.body.selectedFriend.split(" ")
        console.log('unfriend list',selectedFriend)
        // create_newGroup(username,selectedFriends,groupName,now)
        //     .then(val=>res.redirect('/user/friends'))        
        //     .catch(err=>console.log('error in sending message friend',err))
    }
    else{
        res.redirect('/')
    }
})
module.exports=app