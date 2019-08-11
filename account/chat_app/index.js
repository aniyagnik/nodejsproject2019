const express=require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let path=require('path')

const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,delete_loginAcc}=require('../../database/IdsCollection')
//app.use(express.static((__dirname)+'/public'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
let users=[]

function takeUsers(){
  get_allLogins().then(result=>{
    console.log("all users",result);
    users=result.map(ele=>{ele.username});
  })
}
console.log('hoohohoh')

app.get('/', function(req, res){
  console.log('in chat get') 
  // takeUsers();
  if(req.user){
  const {username}=req.user
  res.render('index')
  //io.emit('get_user',{users:users})
  }
  else{
    res.redirect('/')
  }
});


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

  module.exports=app
