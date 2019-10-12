var timer;
var timerStart;
var timeSpentOnSite = getTimeSpentOnSite();
var totalTime=getTotalOnlineTime()

function getTotalOnlineTime(){
    totalTime = parseInt(localStorage.getItem('totalTime'));
    totalTime = isNaN(totalTime) ? 86402000 : totalTime;
    return totalTime;
}

function getTimeSpentOnSite(){
    timeSpentOnSite = parseInt(localStorage.getItem('timeSpentOnSite'));
    timeSpentOnSite = isNaN(timeSpentOnSite) ? 0 : timeSpentOnSite;
    return timeSpentOnSite;
}

function startCounting(){
    timerStart = Date.now();
    timer = setInterval(function(){
        if(timeSpentOnSite>totalTime)
        {
            const t=timeSpentOnSite
            location.href="/user/logout?time="+timeSpentOnSite
            return }
        timeSpentOnSite = getTimeSpentOnSite()+(Date.now()-timerStart);
        localStorage.setItem('timeSpentOnSite',timeSpentOnSite);
        timerStart = parseInt(Date.now());
        // Convert to seconds
        //document.getElementById('timeSpent').innerText= (parseInt(timeSpentOnSite/1000));
        
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