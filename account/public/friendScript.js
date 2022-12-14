
function removeRequestRec (requester){
    const ele=document.getElementById(requester)
    ele.parentNode.removeChild(ele)
    const dropRec=$('#dropRec')
    console.log('in remove request',dropRec.children().length)
    if (dropRec.children().length === 0) {console.log('in if')
        dropRec.append(`<div style="position: relative;"><a  href="#">No request</a> </div>`);
    }
    const username=$('#username').val()
    axios.post('/user/friends/removeFriendRequest',{sender:requester,reciever:username})
    .then(w=>alert('request removed'))
}


function removeRequestSend (requester){
    const ele=document.getElementById(requester)
    ele.parentNode.removeChild(ele)
    const dropSend=$('#dropSend')
    console.log('in remove request',dropSend.children().length)
    if (dropSend.children().length === 0) {console.log('in if')
        dropSend.append(`<div style="position: relative;"><a  href="#">No request</a> </div>`);
    }
    const username=$('#username').val()
    axios.post('/user/friends/removeFriendRequest',{sender:username,reciever:requester})
    .then(w=>alert('request removed'))
}
function edit_hiddenInput(checkOf){
    let value=$("#unFriend").val()
    console.log("value in function ",checkOf)
    console.log('in edit',value.includes(checkOf))
    if(!value.includes(checkOf)){
        console.log('in if')
        value+= (checkOf+" ")
        $("#unFriend").val(value)
    }else{
        const a=(checkOf+" ")
        value=value.replace(a,"")
        $("#unFriend").val(value)
    }
}
function checkForRemoveInput(){
    console.log($('#unFriend').val().length)
    if($('#unFriend').val().length>2){
        if(window.confirm('are you sure you want to remove selected users as your friend..')){
            console.log('in if to send request')
            $("#unFriend").val($('#unFriend').val().slice(0,-1))
            return true
        }
    }else{
        alert("select at least one user")
        return false
    }
}


function checkForGroupInput(){
    if($('#unFriend').val().length>2){
        const message=window.prompt('enter group name..')
        console.log(message)
        $("#groupName").val(message)
        if(message!==null){
            console.log('sending request for group')  
            const date=new Date();
            const now = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes();      
            $("#time").val(now)
            $("#selectedFriend").val($('#unFriend').val().slice(0,-1))
            return true
        }
        return false
    }else{
        alert("select at least one user")
        return false
    }
}