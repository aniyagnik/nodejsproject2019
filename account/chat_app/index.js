const url = require('url');
const express=require('express')
const date = require('date-and-time');
var app = express();
let path=require('path')
const hbs=require('hbs')
hbs.registerPartials(path.join(__dirname,'../partials'))

const {check_chatCollection,add_recievedChatComment,add_sendChatComment,get_userChat,save_unseenChats,get_unseenUserChats,delete_unseenUserChats}=require('../../database/chatCollection')
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,delete_loginAcc,change_chatStatus,change_onlineStatus}=require('../../database/IdsCollection')
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
let users=[]

 app.get('/', function(req, res){
    console.log('in chat get') 
    if(req.user)
    {
      let chatterImg,unseenChats
      const chatWith=req.query.searchUser
      const {username}=req.user
      const {senderMsg}=req.params
      const {sender}=req.params
      get_unseenUserChats(username)
      .then(document=>{console.log('undeen chats arae : ',document); unseenChats=document;return true})
      .then(val=>{
        if(typeof chatWith!=='undefined')
        {
          change_chatStatus(username,true)
          .then(res=>get_loginAcc(chatWith))
          .then(document=>{//console.log("user found : ",document)
                if(document!==null)
                {
                  chatterImg=document.image
                  return true
                }  
                else{
                  res.redirect('/not-found') 
                }
          })
          .then(hmm=>get_userChat(username,chatWith))  
          .then(chat=>{
           // console.log('chat is this : ',chat)
            if(chat!==null)
            {
              let {message}=chat
             // console.log("geting chat for displaying",chatWith,message,chatterImg)
              res.render('chatPage',{username,chatWith,message,chatterImg,unseenChats})
            }
            else{
              res.render('chatPage',{username,chatWith,chatterImg,unseenChats})
            }
          })  
        }
        else{
          change_chatStatus(username,true)
          .then(as=>res.render('chatPage',{username,unseenChats}))
        }  
      })
      
    }
    else
    {
      res.redirect('/access-denied')
    }
  });

app.get('/unseenMessage', function(req, res){
  console.log('in chat get unseen') 
  if(req.user)
  {
    const {username}=req.user
    const chatWith=req.query.senderUser
    console.log('user to be find and chat : ',chatWith)
    get_loginAcc(chatWith)
      .then(document=>{console.log("user found : ",document)
            if(document!==null)
            {
              delete_unseenUserChats(username,chatWith)
              .then(hm=>{
                console.log('in unseen post sending render')
                res.redirect(url.format({
                  pathname:"/user/chat",
                  query: {
                    searchUser:chatWith
                  }
                }))
              })
            }  
            else{
              res.redirect('/not-foundr') 
            }
      })
      .catch(err=>{
          console.log('error occured : ',err)
          res.redirect('/user/chat')
      })
  }
  else
  {
    res.redirect('/access-denied')
  }
});
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
        const username=users.reduce(ele=>ele.socketId===socket.id)
        users=users.filter(ele=>ele.socketId!==socket.id)
       // console.log('on removal of one user',users)
        if(typeof username!=='undefined')
           console.log('changing chat staus to false') 
           change_chatStatus(username,false)
      } 
    });

    
    

    //reading a message and then sending
    socket.on('message',(msg_taken)=>{
      //console.log('in message index',msg_taken.message)
      const now = new Date();
      date.format(now, 'ddd., MMM. DD YYYY'); 
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
      const now = new Date();
      date.format(now, 'ddd., MMM. DD YYYY'); 
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