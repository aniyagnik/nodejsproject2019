

 $('#logout').click(e=>{
     const val=parseInt(localStorage.getItem('sessionTime'));
     alert("time spent is "+val)
     location.href="/user/logout?time="+val
 })

$.ajax({
    type: "GET",
    url: "/user/getUserTime",
})
.then((data) =>{
    localStorage.setItem('todayTime',data.todayTime);
    localStorage.setItem('maxLimit',data.maxLimit);
})

var timer;
var timerStart;
var sessionTime = getsessionTime();
var maxLimit=getmaxLimit()


function getmaxLimit(){
    maxLimit = parseInt(localStorage.getItem('maxLimit'));
    maxLimit = isNaN(maxLimit) ? 86402000 : maxLimit;
    return maxLimit;
}

function getsessionTime(){
    sessionTime = parseInt(localStorage.getItem('sessionTime'));
    sessionTime = isNaN(sessionTime) ? 0 : sessionTime;
    return sessionTime;
}

function startCounting(){
    timerStart = Date.now();
    timer = setInterval(function(){
        if(sessionTime>maxLimit)
        {
            window.localStorage.clear()            
            location.href="/user/logout?time="+sessionTime
            return }
        sessionTime = getsessionTime()+(Date.now()-timerStart);
        localStorage.setItem('sessionTime',sessionTime);
        timerStart = parseInt(Date.now());
        // Convert to seconds
        //document.getElementById('timeSpent').innerText= (parseInt(sessionTime/1000));
        
    },1000);
}
startCounting();

var stopCountingWhenWindowIsInactive = true; 

if( stopCountingWhenWindowIsInactive ){

    if( typeof document.hidden !== "undefined" ){
        var hidden = "hidden", 
        visibilityChange = "visibilitychange", 
        visibilityState = "visibilityState";
    }else if ( typeof document.msHidden !== "undefined" ){
        var hidden = "msHidden", 
        visibilityChange = "msvisibilitychange", 
        visibilityState = "msVisibilityState";
    }
    var documentIsHidden = document[hidden];

    document.addEventListener(visibilityChange, function() {
        if(documentIsHidden != document[hidden]) {
            if( document[hidden] ){
                // Window is inactive
                clearInterval(timer);
            }else{
                // Window is active
                startCounting();
            }
            documentIsHidden = document[hidden];
        }
    });
}