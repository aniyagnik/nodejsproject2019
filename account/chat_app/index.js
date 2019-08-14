const express=require('express')
var app = express();
let path=require('path')

const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,delete_loginAcc,edit_onlineStatus}=require('../../database/IdsCollection')
app.use(express.static((__dirname)+'/public'))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
let users=[]

module.exports=function(io){
  app.get('/', function(req, res){
    console.log('in chat get') 
    if(req.user)
    {
      const {username}=req.user
      edit_onlineStatus(username)
      .then(result=>{
        res.render('index',{username})
      })
    }
    else{
      res.redirect('/')
    }
  });
     
  io.on('connection', function(socket){
    console.log('a user connected ',socket.id);

    //deleting a client
    socket.on('disconnect', function(){
      console.log('user disconnected',username);
      edit_onlineStatus(username)
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
  
  return app;
}
