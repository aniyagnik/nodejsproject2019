const passport=require('passport')
const LocalStratergy=require('passport-local').Strategy
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,delete_loginAcc}=require('../databases/IdsDatabase')

/*in serializeUser we send user(how to store a user in a session) and
 in serialize user we get the user(how to actually recover the user from the session)
 */

passport.serializeUser(function (user, done) {
    done(null, user.username)
})

passport.deserializeUser(function (username, done) {
    console.log('in deserializeUser',username)
    get_loginAcc(username)
    .then(user=>{
        console.log('user : ',user)
        if(user==null)
        {return done(null,false,{message:'no such user'})}
        else{return done(null,user)}
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
        console.log('user: ',user)
        if(user==null)
        {return done(null,false,{message:'no such user'})}
        else{console.log('user in local',user)
            return done(null,user)}
    })
    .catch(err=>{
        console.log('error in finding the account in localStratergy',err)
        return done(null,false,{message:'no such user'})
    })
}))

 module.exports=passport