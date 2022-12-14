const passport=require('passport')
const LocalStratergy=require('passport-local').Strategy
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,delete_loginAcc,change_onlineStatus}=require('../database/IdsCollection')

/*in serializeUser we send user(how to store a user in a session) and
 in serialize user we get the user(how to actually recover the user from the session)
 */

passport.serializeUser(function (user, done) {
    done(null, user.username)
})

passport.deserializeUser(function (username, done) {
    //console.log('in deserializeUser',username)
    get_loginAcc(username)
    .then(user=>{
        
        if(user==null)
        { 
            console.log('usr NOT found')
            return done(null,false,{message:'no such user'})}
        else{//console.log('usr found')
            return done(null,user)}
    })
    .catch(err=>{
        console.log('error in finding the account')
        return done(err)
    })
})


passport.use(new LocalStratergy(function (username, password, done) {
    console.log('in LocalStratergy  : ',username,password)
    check_loginAcc(username,password)
    .then(user=>{
        if(user==null)
        {return done(null,false,{message:'no such user'})}
        else{
            change_onlineStatus(username,true)
            return done(null,user)}
    })
    .catch(err=>{
        console.log('error in finding the account in localStratergy',err)
        return done(null,false,{message:'no such user'})
    })
}))

 module.exports=passport