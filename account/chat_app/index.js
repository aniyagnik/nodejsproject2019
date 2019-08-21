const express=require('express')
var app = express();
let path=require('path')
const {create_chatInfo,add_chatComment,save_unseenChat}=require('../../database/chatCollection')
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,delete_loginAcc,change_chatStatus,change_onlineStatus}=require('../../database/IdsCollection')
app.use(express.static((__dirname)+'/public'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
let users=[]

module.exports=function(io){
  app.get('/', function(req, res){
    console.log('in chat get') 
    if(req.user)
    {
      const {chatWith}=req.query
      const {username}=req.user
      const {senderMsg}=req.params
      const {sender}=req.params
     
      change_chatStatus(username,true)
      .then(doc=>{
        // console.log('haaaaaaaaaaaaaaa',senderMsg)
        res.render('index',{username,chatWith})
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
      })
    }
    else
    {
      res.redirect('/')
    }
  });

  app.post('/', function(req, res){
    console.log('in chat post') 
    if(req.user)
    {
      const {username}=req.body
      get_loginAcc(req.body.searchUser)
       .then(document=>{console.log("user found : ",document)
             if(document!==null)
             {
                res.redirect('/user/chat?chatWith='+req.body.searchUser) 
             }  
             else{
                res.redirect('/user/dashboard?return=no-such-user') 
             }
       })
       .catch(err=>{
           console.log('error occured : ',err)
           res.redirect('/user/chat')
       })
    }
    else
    {
      res.redirect('/')
    }
  });
     
  io.on('connection', function(socket){
    console.log('a user connected ',socket.id);
     socket.emit('get_socketID',{socketId:socket.id})
    //getting username and socket.id
    socket.on('get_user',(userInfo)=>{
      const user={ username:userInfo.username,
                   socketId:userInfo.socketId
                }
      users.push(user)
       console.log('all active users :: ',users)
    })

    //deleting a client
    socket.on('disconnect', function(){
      console.log('user disconnected',socket.id);
      const username=users.reduce(ele=>ele.socketId===socket.id)
      users=users.filter(ele=>ele.socketId!==socket.id)
      console.log('on removal of one user',users)
      change_chatStatus(username,false)
    });

    
    //reading a message and then sending
    socket.on('message',(msg_taken)=>{
      //console.log('in message index',msg_taken.message)
      console.log(msg_taken.selected_user)
      console.log('sending to selected personal')
      const id=users.find(ele=>ele.username===msg_taken.selected_user).socketId
      io.to(id).emit('res_msg',{
        user:msg_taken.user,
        message:msg_taken.message,
      })
      const chatters=msg_taken.user+'and'+msg_taken.selected_user
      console.log('chatters',chatters)
      add_chatComment(chatters,msg_taken.user,msg_taken.message)
    })
  });
  
  return app;
}
