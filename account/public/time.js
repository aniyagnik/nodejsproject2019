
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
var todayTime = gettodayTime();
var maxLimit=getmaxLimit()


function getmaxLimit(){
    maxLimit = parseInt(localStorage.getItem('maxLimit'));
    maxLimit = isNaN(maxLimit) ? 86402000 : maxLimit;
    return maxLimit;
}

function gettodayTime(){
    todayTime = parseInt(localStorage.getItem('todayTime'));
    todayTime = isNaN(todayTime) ? 0 : todayTime;
    return todayTime;
}

function startCounting(){
    timerStart = Date.now();
    timer = setInterval(function(){
        if(todayTime>maxLimit)
        {
            const t=todayTime
            location.href="/user/logout?time="+todayTime
            return }
        todayTime = gettodayTime()+(Date.now()-timerStart);
        localStorage.setItem('todayTime',todayTime);
        timerStart = parseInt(Date.now());
        // Convert to seconds
        //document.getElementById('timeSpent').innerText= (parseInt(todayTime/1000));
        
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