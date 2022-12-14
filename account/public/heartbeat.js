const username=document.getElementById("username").value

function hearbeat(){
    // every 10 seconds
    setTimeout(()=>{
        console.log('in timeout')
    $.get('/heartbeat?name='+username,()=>{
            hearbeat()
        })
    },10000)
}
hearbeat()