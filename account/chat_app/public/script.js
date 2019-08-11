//const socket = io();
let selected_user=[]
/*const my_username=req.user.username
socket.on('connected', () => {
    console.log("Connected " + socket.id)
})
  

    const msg=$('#msg')
    const send_msg=$('#send_msg')
    const recieved_msg=$('#recieved_msg')
    const msg_btn=$('#msg_btn')
    const sent_msg=$('#sent_msg')
    const div_recieve=$('#div_recieve')
    const div_sent=$('#div_sent')
    const user_list=$('#user_list')
   

    //getting active users
    socket.on('get_user',data=>{          
            let user_nm=data.users
            let html='<h4>active users :</h4><br>'
            let filter_arr=user_nm.filter(ele=>ele.name!==my_username)
            filter_arr.forEach(ele=>{
            html+=`<button class='user_btn' id=`+ ele.id + `> ` + ele.name + `</button><br><br>`
            })
            user_list.html(html)
    })

   //selcting user 
   user_list.click((e)=>{
       let user_val=e.target
       //console.log(user_val)
       console.log(selected_user)
       clicked_user=user_val.innerText
        console.log('clicked_user',clicked_user)
        const user_exists_index=selected_user.findIndex((element,index)=>element.user===clicked_user)
        
        console.log('user_index',user_exists_index,typeof user_exists_index)

        if(user_exists_index===-1)
        {
            console.log('adding selected_user')
            add_user()
            //user_val.className+=' selected'
        }
        else{
            console.log('deleting from selected_user')
            selected_user.splice(user_exists_index,1)
            console.log('selected users : ',selected_user)
            user_val.classList.remove('selected')
            //user_val.className.replace(/(?:^|\s)selected(?!\S)/g,'')
        }

      console.log(selected_user)
      function add_user(){
        console.log('in add_user')
        const value={
            user:clicked_user,
            id:user_val.id
           }
        selected_user.push(value)
   user_val.classList.add('selected')
   }
   })
   
   //sending message
   msg_btn.click((e)=>{
        e.preventDefault()
        //console.log('in message',send_msg.val())
        const message=send_msg.val()
        if(selected_user!==null)
      {
        updated_msg=message
        socket.emit('message',{
            selected_user:selected_user,
            user:my_username,
            message:updated_msg})
      }
      else{
        socket.emit('message',{
            user:my_username,
            message:message})
      } 
   })
   
  
   //printing the message on page 
    socket.on('res_msg',res_msg=>{
       
           console.log('my_username',my_username)
            console.log('printing message you recieved')
            console.log(res_msg.personal)
            if(res_msg.personal)
            {
                if(res_msg.user===my_username)
                {console.log('sent by me in personal')
                    let sel_user=selected_user.reduce((acc,ele)=>acc+','+ele.user,'')
                    sent_msg.append($(`<li>sent on personal to ${sel_user}: ${res_msg.message}</li>`))
                }
                else{console.log('to me in personal')
                    recieved_msg.append($(`<li><b>sent personal by ${res_msg.user}</b>:${res_msg.message}</li>`))
                }                        
            }
             else{
                if(res_msg.user===my_username)
                {console.log('sent by me in not personal')
                    sent_msg.append($(`<li>${res_msg.message}</li>`))
                }
                else{console.log('to me in not personal')
                    recieved_msg.append($(`<li><b>${res_msg.user}</b>:${res_msg.message}</li>`))
                } 
             }
    })
 
*/