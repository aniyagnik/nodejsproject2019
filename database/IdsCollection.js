const { MongoClient }=require('mongodb')
//var mongoUrl=process.env.MONGOLAB_URI
var mongoUrl="mongodb://project:projectQ12@cluster0-shard-00-00-6zit8.mongodb.net:27017,cluster0-shard-00-01-6zit8.mongodb.net:27017,cluster0-shard-00-02-6zit8.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
client=new MongoClient(mongoUrl || 'mongodb://localhost:27017/project',{ useNewUrlParser: true })
client.connect()
//accessing database testdb and then sending  collection loginIds
const get_db=()=>{       
        const db=client.db('test')
        return new Promise(function(resolve, reject){
            resolve(db);
        });
    }

    

//accessing collection for checking a loginAcc
const get_allLogins=()=>{
    return get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>console.log('error in fetching 1'))
    .then(collection=>collection.find())
    .catch(err=>console.log('error in fetching 2'))
    .then(cursor=>{
       // console.log(cursor.toArray())
        return cursor              
    })
    .catch(err=>console.log('error in fetching '))

}

 //inserting in collection loginIds
async function insert_loginAcc (Id_info){
      let value=1
    const resultUser= await get_db()
            .then(db=>db.collection('loginIds'))
            .catch(err=>{
                console.log('error in collection 1')
                return false    
            })
            .then(collection=>collection.findOne({username:Id_info.username}))
            .then(result=>{
                if(result===null)
                 {return false}
                 else{return true}  
            })
            .catch(err=>{
                console.log('error in collection 2')
                return false   
            })

    const resultEmail= await get_db()
            .then(db=>db.collection('loginIds'))
            .catch(err=>{
                console.log('error in collection 1')
                return false    
            })
            .then(collection=>collection.findOne({email:Id_info.email}))
            .then(result=>{
                if(result===null)
                 {return false}
                 else{return true}  
            })
            .catch(err=>{
                console.log('error in collection 2')
                return false   
            })
            

      
    console.log('results :::: ')
    console.log(resultUser,resultEmail )
    if(!resultUser && !resultEmail)
    {
        value= await get_db()
                .then(db=>db.collection('userImages'))
                .catch(err=>console.log('error in accessing in collection images '))
                .then(collection=>{
                    add={username:Id_info.username,
                        images:[]
                    }
                    collection.insertOne(add)
                    return true
                })
                .then(ha=>{console.log('images :',ha);return true})
                .catch(err=>console.log('error in saving in collection images '))
                get_db()
                .then(db=>db.collection('unseenChatCollection'))
                .catch(err=>console.log('error in accessing in collection unseenChat '))
                .then(collection=>{
                    add={username:Id_info.username,
                        unseenChats:[]
                    }
                    return collection.insertOne(add)
                })
                .catch(err=>console.log('error in adding in collection messages '))                                   
                .then(ha=>{
                    return get_db()})
                .then(db=>db.collection('loginIds'))
                .then(collection=>{
                    let userDetails={
                        email:Id_info.email,
                        username:Id_info.username,
                        password:Id_info.password,
                        image:'/user/image/image.jpg',
                        wallPic:'/user/image/wallpic.png',
                        friends:[],
                        requestsRecieved:[],
                        requestsSend:[],
                        online:false,
                        createdOn:Id_info.createdOn,
                        totalTime:0,
                        maxLimit:86402000,
                        todayTime:0,
                        active:true
                    }
                    return collection.insertOne(userDetails)})
                .catch(err=>console.log('error in saving collection credentials 1',err))
                .then(doc=>{
                    console.log('inserted values is :',doc.ops[0])
                    return doc
                })
                .catch(err=>console.log('error in saving collectio ids 2',err))
        console.log('awaits ends')
    } 
    else{                
        value=false
    }           
    console.log('value of insertion:',value)
    return value
}    

const set_appLock=(username,limit)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>collection.updateOne(
            { username:username },
            {
            $set: { "maxLimit": limit },
            
            }
    ))  
    .then(document=>{
    if(document==null){
        console.log('error in finding username  to set max limit')
        return null
    }  
    else{      
    console.log('username matched. max limit set')
            return document
    }
    })
    .catch(err=>{
        console.log('error in finding the account')
        return err
    })
  

   
const change_activeStatus=(email,status)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>{
        return collection.updateOne(
            { email:email },
            {
            $set: { active: status },
            }
        )
    })  
    .then(document=>{
    if(document==null){
        console.log('error in finding username ')
        return null
    }  
    else{      
    console.log('user active status updated')
            return document
    }
    })
    .catch(err=>{
        console.log('error in finding the account')
        return err
    })

    //get one login Id requested by client through username
const  check_loginAcc =(username,password)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        return null    
    })
    .then(collection=>{
       // console.log(collection)
        return collection.findOne({username:username})
    })  
    .then(document=>{
      if(document==null){
        console.log('error in finding username ')
        return null
      }  
      else{      
      console.log('username matched')
      //console.log('document : ',document)  
      if(document.password===password)
        {
            console.log('pASSWORD MATHCED')
            if(document.maxLimit<document.todayTime || document.active===false){
                return false
            }else{
                return document
            }
        }
        else{
            console.log('error in password')
            return null
        }
      }
    })

const  check_userEmail =(email)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        return null    
    })
    .then(collection=>{
       // console.log(collection)
        return collection.findOne({email:email})
    })  
    .then(document=>{
      if(document==null){
        console.log('could not find email ')
        return false
      }  
      else{      
        console.log('email matched')
        return true
      }
    })
    .catch(err=>{console.log("error in finding email : ",err);return false})
        
const change_onlineStatus=(username,status)=>
     get_db()
     .then(db=>db.collection('loginIds'))
     .catch(err=>{
         console.log('error in collection')
         res.send('error1')    
     })
     .then(collection=>{
         return collection.updateOne(
             { username:username },
             {
             $set: { online: status },
             }
         )
     })  
     .then(document=>{
     if(document==null){
         console.log('error in finding username ')
         return null
     }  
     else{      
     console.log('user online status updated')
             return document
     }
     })
     .catch(err=>{
         console.log('error in finding the account')
         return err
     })

 
const change_onlineTime=(username,time)=>
     get_db()
     .then(db=>db.collection('loginIds'))
     .catch(err=>{
         console.log('error in collection')
         res.send('error1')    
     })
     .then(collection=>{
         return collection.updateOne(
             { username:username },
             {
             $inc: { 
                 totalTime:time,
                 todayTime:time   
                },
             }
         )
     })  
     .then(document=>{
     if(document==null){
         console.log('error in finding username to update online time')
         return null
     }  
     else{      
     console.log('user time updated')
             return null
     }
     })
     .catch(err=>console.log('error in finding the account for time update',err))
   
//get one login Id requested by client through username
const  get_loginAcc =(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
    })
    .then(collection=>{
      //  console.log(collection)
        return collection.findOne({username:username})
    })  
    .then(document=>{
      if(document==null){
        console.log('error in finding username ')
        return null
      }  
      else{      
      console.log('username matched')
            return document
      }
    })

const change_userPass=(username,newPassword)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>collection.updateOne(
            { username:username },
            {
                $set: { password :newPassword },
            }
        )
    )  
    .catch(err=>{
        console.log('error in finding the account',err)
        return false
    })

 
const change_userProfilePic=(username,filename)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>{
    //  console.log(collection)
        return collection.updateOne(
            { username:username },
            {
            $set: { "image": filename },
            
            }
        )
    })  
    .then(document=>{
    if(document==null){
        console.log('error in finding username ')
        return null
    }  
    else{      
    console.log('username matched')
            return document
    }
    })
    .catch(err=>{
        console.log('error in finding the account')
        return err
    })


const change_userEmail=(username,newEmail)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>{
    //  console.log(collection)
        return collection.updateOne(
            { username:username },
            {
            $set: { "email": newEmail },
            
            }
        )
    })  
    .then(document=>{
    if(document==null){
        console.log('error in finding username ')
        return null
    }  
    else{      
    console.log('username matched'.document)
            return document
    }
    })
    .catch(err=>{
        console.log('error in finding the account')
        return err
    })



const change_userWallPic=(username,filename)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>{
    //  console.log(collection)
        return collection.updateOne(
            { username:username },
            {
            $set: { "wallPic": filename },
            
            }
        )
    })  
    .then(document=>{
    if(document==null){
        console.log('error in finding username ')
        return null
    }  
    else{      
    console.log('username matched')
            return document
    }
    })
    .catch(err=>{
        console.log('error in finding the account')
        return err
    })
   

    //deleting in collection loginIds
const delete_loginAcc=(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.remove({username:username}))
    .then(ha=>{
        console.log('user deleted',ha.message.documents); 
        return ha.message.documents
    })
    .catch(err=>{
        console.log('error in deleting account',err)
        return false    
    })


const get_todayTime=(name)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.findOne({username:name}))
    .then(user=>{
        console.log("today time of user is : ",user.todayTime)
        return user.todayTime
    })
    .catch(err=>console.log('error in getting today time : ',err))

const get_userTime=(name)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.findOne({username:name}))
    .then(user=>{
        console.log("getting user total and today time")
        const doc={
            todayTime:user.todayTime,
            maxLimit:user.maxLimit
        }
        return doc
    })
    .catch(err=>console.log('error in getting user time : ',err))        


const get_userTotalTime=(name)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.findOne({username:name}))
    .then(user=>{
        console.log("total time  limit for user is available",user.totalTime,typeof user.totalTime)
            return {totalTime:user.totalTime}
    })
    .catch(err=>console.log('error in getting user time : ',err))        

module.exports={
    check_userEmail,
    change_userEmail,
    get_allLogins,
    check_loginAcc,
    get_loginAcc,
    insert_loginAcc,
    change_userPass,
    delete_loginAcc,
    change_userProfilePic,
    change_userWallPic,
    change_onlineStatus,
    change_activeStatus,
    change_onlineTime,
    set_appLock,
    get_todayTime,
    get_userTotalTime,
    get_userTime
}

var now = new Date();
var millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 0, 0) - now;
if (millisTill12 < 0) {
     millisTill12 += 86400000; // it's after 12am
}
setInterval(async function (){
    let k=await get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.updateMany({},
        {
            $set:{
                todayTime:0
            }
        }))
    millisTill12=86400000    
    
    let s=await get_db()
    .then(db=>db.collection('newLoginCollection'))
    .then(collection=>collection.drop())
},millisTill12)