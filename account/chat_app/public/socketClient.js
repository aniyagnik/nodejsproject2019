$(document).ready(function () {
    $('html, body').animate({
        scrollTop: $('#last').offset().top    
    }, 'slow');
    $('#chat_messages').animate({
        scrollTop: $('#last').offset().top    
    }, 'slow');
});
const socket = io();
console.log('in script js')
let selected_user=$('#chatUser').val()
let my_username=$('#username').val()
let socketId
socket.on('connected', () => {
    console.log("Connected " + socket.id)
})
  

    const msg=$('#msg')
    const send_msg=$('#send_msg')
    const msg_btn=$('#msg_btn')
    const chat_messages=$('#chat_messages')
    const div_recieve=$('#div_recieve')
    const div_sent=$('#div_sent')
    const user_list=$('#user_list')
    const waitingMsg=$('#waitingMsg')
   
    //get usr socket.id
    socket.on('get_socketID',(socketI)=>{
        socketId=socketI.socketId

        //sending username and socket.id
        socket.emit('get_user',{
            username:my_username,
            socketId:socketId
        })

    })   
   
   //sending message
   msg_btn.click((e)=>{
        e.preventDefault()
        console.log('in message click')
        let now
        (function getFormattedDate() {
          let date = new Date();
          now = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes();
        })()
        const message=send_msg.val() 
        chat_messages.append($(`<div class="d-flex justify-content-end mb-4">
                             <div class="msg_cotainer_send">
                                ${message}
                                  <span class=" msg_time_send"  style='min-width:30vw; text-align:right;'>${now}</span>
                             </div>
                           </div>`))
        $('#send_msg').val("")                    
        socket.emit('message',{
            selected_user:selected_user,
            user:my_username,
            message:message})  

   })
   
  
   //printing the message on page 
    socket.on('res_msg',res_msg=>{
        console.log('my_username',my_username)
        console.log('printing message you recieved')
        console.log('to me in personal')
        let now
        (function getFormattedDate() {
          let date = new Date();
          now = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes();
        })()
        if(selected_user===res_msg.user)
        {
            chat_messages.append($(`<div class="d-flex justify-content-start mb-4">
                                    <div class="msg_cotainer">
                                        ${res_msg.message}
                                        <span class="msg_time" style='min-width:30vw'>${now}</span>
                                    </div>
                                </div>`))
        }
        else{
            let noMsg=$('#noMsg')
            if(noMsg.length!==0)
            {
                noMsg.remove()
            }
            let unseenUserChat=$(`#uMsg${res_msg.user}`)
            let unseenUserChatTime=$(`#uMsgTime${res_msg.user}`)
            if(unseenUserChat.length===0)
            {
                waitingMsg.append($(`
                    <div  class='unseenMsg'id='${res_msg.user}'> 
                        <a href='/user/chat?searchUser=${res_msg.user}'  onclick='return deleteUnseen("${res_msg.user}");'>
                            <p class='chatUserHead' >${res_msg.user}</p>
                            <input type='hidden' value='${res_msg.user}' name='senderUser' id='senderUser'>
                            <p id='uMsg${res_msg.user}'> ${res_msg.message} </p>
                            <div><small id='uMsgTime${res_msg.user}'>${now}</small><div>
                        </a>
                        <hr width="100%" style='border:1px solid black;opacity:0.5'>
                    </div>`))
   
            }
            else{
                unseenUserChat.text(`${res_msg.message}`)
                unseenUserChatTime.text(`${now}`)
            }                    
            socket.emit("messageRecieved",{
                reciever:my_username,
                sender:res_msg.user,
                message:res_msg.message
            })                              
        }                                                                
    })

$(document).ready(function(){
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
});
    

function deleteUnseen(user){
    socket.emit('deleteUnseen',{
        reciever:my_username,
        sender:user
    })
    return true
}


    
