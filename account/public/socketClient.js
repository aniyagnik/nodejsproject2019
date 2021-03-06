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
        const message=send_msg.val() 
        chat_messages.append($(`<div class="d-flex justify-content-end mb-4">
                             <div class="msg_cotainer_send">
                                ${message}
                                <span class="msg_time_send">8:55 AM, Today</span>
                             </div>
                           </div>`))
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
        if(selected_user===res_msg.user)
        {
            chat_messages.append($(`<div class="d-flex justify-content-start mb-4">
                                    <div class="msg_cotainer">
                                        ${res_msg.message}
                                        <span class="msg_time">8:40 AM, Today</span>
                                    </div>
                                </div>`))
            socket.emit("messageRecieved",{
                reciever:my_username,
                sender:selected_user,
                message:res_msg.message
            })                    
        }
        else{
            waitingMsg.append($(`<div  id='unseenMsg' > 
                                    <form action='/user/chat/unseenMessage' method='POST'>
                                    <p style="color: chocolate" open=''>
                                        <p style='color:black; font-style:bold;' id='senderUser'>${res_msg.user}</p>
                                        <p id='senderMsg'> ${res_msg.message}</p>
                                        <input type="hidden" id='senderMsg' value= ${res_msg.message}>
                                        <input type="hidden" id="senderUser" value=${res_msg.user}>
                                        <button id='msgLink' type='submit'>chat</button>
                                    </p>
                                    </form>
                                </div>`))
        }                                                                
    })

$(document).ready(function(){
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
});
    