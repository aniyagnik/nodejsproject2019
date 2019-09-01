const url = require('url');
const express=require('express')
const date = require('date-and-time');
var app = express();
let path=require('path')
const hbs=require('hbs')
hbs.registerPartials(path.join(__dirname,'../partials'))

const {check_chatCollection,add_recievedChatComment,add_sendChatComment,get_userChat,save_unseenChats,get_unseenUserChats,delete_unseenUserChats,delete_userChat}=require('../../database/chatCollection')
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,delete_loginAcc,change_chatStatus,change_onlineStatus}=require('../../database/IdsCollection')
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
let users=[]

 app.get('/', function(req, res){
    console.log('in chat get') 
    if(req.user)
    {
      let chatterImg,unseenChats,onlineStatus
      const chatWith=req.query.searchUser
      const {username}=req.user
      const {senderMsg}=req.params
      const {sender}=req.params
      get_unseenUserChats(username)
      .then(document=>{console.log('undeen chats arae : ',document); unseenChats=document;return true})
      .then(val=>{
        if(typeof chatWith!=='undefined' || chatWith===username)
        {
          change_chatStatus(username,true)
          .then(res=>get_loginAcc(chatWith))
          .then(document=>{//console.log("user found : ",document)
                if(document!==null)
                {
                  onlineStatus=document.online
                  chatterImg=document.image
                  return true
                }  
                else{
                  res.redirect('/user/chat') 
                }
          })
          .then(hmm=>get_userChat(username,chatWith))  
          .then(message=>{
           console.log('chat is this : ',message)
           return message
          })
          .then(message=> res.render('chatPage',{username,chatWith,message,chatterImg,unseenChats,onlineStatus})) 
          .catch(err=>console.log('error is ',err)) 
        }
        else{
          change_chatStatus(username,true)
          .then(as=>res.render('chatPage',{username,unseenChats}))
        }  
      })
      
    }
    else
    {
      res.redirect('/')
    }
  });


app.post('/deleteChat',(req,res)=>{
  console.log('in get deleting chat')
  if(req.user){
    const {username}=req.user
    const {chatWith}=req.body
    console.log('req.body',req.body)
    console.log('user and chat with',chatWith)
    delete_userChat(username,chatWith)
    .then(done=>res.redirect(`/user/chat/?searchUser=${chatWith}`))
  }
  else{
    res.redirect('/')
  }
})
  module.exports=function(io){
 
     
  io.on('connection', function(socket){
    console.log('a user connected ',socket.id);
     socket.emit('get_socketID',{socketId:socket.id})
    
     //getting username and socket.id
    socket.on('get_user',(userInfo)=>{
      const user={ username:userInfo.username,
                   socketId:userInfo.socketId
                }
      users.push(user)
       //console.log('all active users :: ',users)
    })

    //deleting a client
    socket.on('disconnect', function(){
      console.log('user disconnected',socket.id);
      if(users.length!==0)
      {
        const username=users.reduce(ele=>ele.socketId===socket.id).username
        users=users.filter(ele=>ele.socketId!==socket.id)
       console.log('REMOVAL OF USER : ',username)
        if(typeof username!=='undefined')
           console.log('changing chat staus to false',username) 
        change_chatStatus(username,false)
      } 
    });

    
    

    //reading a message and then sending
    socket.on('message',(msg_taken)=>{
      //console.log('in message index',msg_taken.message)
      let now
      (function getFormattedDate() {
        let date = new Date();
        now = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes();
      })()
      console.log("message send to : "+msg_taken.selected_user+'by '+msg_taken.user)
      const reciever=users.find(ele=>ele.username===msg_taken.selected_user)
      console.log('reciever is :',reciever)
      if(typeof reciever!=="undefined")
      {
        io.to(reciever.socketId).emit('res_msg',{
          user:msg_taken.user,
          message:msg_taken.message,
        })
       
        add_sendChatComment(msg_taken.user,msg_taken.selected_user,msg_taken.message,now)
        .then(val=>add_recievedChatComment(msg_taken.selected_user,msg_taken.user,msg_taken.message,now))
      }
      else{
        add_sendChatComment(msg_taken.user,msg_taken.selected_user,msg_taken.message,now)
        .then(val=>add_recievedChatComment(msg_taken.selected_user,msg_taken.user,msg_taken.message,now))
        .then(val=>save_unseenChats(msg_taken.selected_user,msg_taken.user,msg_taken.message,now))
      }
      
    })

    //recieved message
    socket.on('messageRecieved',(msg_taken)=>{
      console.log('reciever and sender is :',msg_taken.reciever,msg_taken.sender)
      let now
      (function getFormattedDate() {
        let date = new Date();
        now = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes();
      })()
      save_unseenChats(msg_taken.reciever,msg_taken.sender,msg_taken.message,now)
    })

    socket.on('deleteUnseen',msg_taken=>{
      console.log('DELETED UNSEEN OF : ',msg_taken.sender)
      delete_unseenUserChats(msg_taken.reciever,msg_taken.sender)
    });
    
  });

 

  return app;
}
 /*if(typeof senderMsg!=='undefined' && users!== 'undefined')
      {
        const recievingUser=users.find(ele=>ele.username===sender)
        if(typeof recievingUser!=='undefined')
        {
          const id=recievingUser.socketId
          io.to(id).emit('res_msg',{
            user:sender,
            message:senderMsg,
          })
          const chatters=msg_taken.user+'and'+msg_taken.selected_user
          console.log('chatters',chatters)
          add_chatComment(chatters,msg_taken.user,msg_taken.message)   
        }
      }*/