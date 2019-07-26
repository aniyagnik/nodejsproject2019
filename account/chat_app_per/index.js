const express=require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let path=require('path')
app.use(express.static((__dirname)+'/public'))

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname,'index.html'));
});
let users=[]

io.on('connection', function(socket){
    console.log('a user connected ',socket.id);
  
    //deleting a client
    socket.on('disconnect', function(){
       console.log('user disconnected');
       let new_users_list=[]
       function socket_to_delete(users){
        for(let i=0;i<users.length;i++)
        {
          if(users[i].id===socket.id)
          {return i}
        }
      }
      const delete_socket_id=socket_to_delete(users)
      for(let i=0;i<users.length;i++)
        {
          if(i!==delete_socket_id){
            new_users_list.push(users[i])
          }
        }
        users=new_users_list
        io.emit('get_user',{users:users})
    });

    //logging a client in
    socket.on('login',(data)=>{
      const username=data.user
      function check_id_existence(username){
        for(let i=0;i<users.length;i++)
        {
          if(users[i].name===username)
          {return 0}
        }
        return 1
      }
      const id_exist=check_id_existence(username)
      console.log('id exist',id_exist)
      if(id_exist==1)
      {
        users.push({
          name:username,
          id:socket.id
        })
       socket.emit('login_result',{user:username,error:null})
       console.log('io.emit')
      io.emit('get_user',{users:users})
      }
      else{
        socket.emit('login_result',{user:username,error:'username already exists'})
      }
    })
 
    //reading a message and then sending
    socket.on('message',(msg_taken)=>{
      //console.log('in message index',msg_taken.message)
      console.log(msg_taken.selected_user)
      if(msg_taken.selected_user.length===0)
      {console.log('sending to all not personal')
           io.emit('res_msg',{
           user:msg_taken.user,
           message:msg_taken.message,
           personal:false
          })
      }
      else{console.log('sending to selected personal')
            msg_taken.selected_user.forEach(element => {
                io.to(element.id).emit('res_msg',{
                user:msg_taken.user,
                message:msg_taken.message,
                personal:true
              })
            });
            socket.emit('res_msg',{
              user:msg_taken.user,
              message:msg_taken.message,
              personal:true
             })
            
      }
     
    })
  });

  module.exports=http
