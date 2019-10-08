var name=document.getElementById("username").value

function hearbeat(){
    console.log('in heartbeat function')
    setTimeout(()=>{
        console.log('in timeout')
    $.get('/heartbeat?name='+name,()=>{
            hearbeat()
        })
    },10000)
}
//hearbeat()