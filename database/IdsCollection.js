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
                .then(db=>db.collection('loginCredentials'))
                .then(collection=>{
                    const credentials={
                        email:Id_info.email,
                        username:Id_info.username,
                        password:Id_info.password,
                    }
                    return collection.insertOne(credentials)})
                .catch(err=>console.log('error in saving collection credentials 1',err))
                .then(doc=>{
                   // console.log('inserted values is :',doc.ops[0])
                    return doc.ops[0]
                })
                .then(ha=>{
                    return get_db()})
                .then(db=>db.collection('loginIds'))
                .then(collection=>{
                    let userDetails={
                        email:Id_info.email,
                        username:Id_info.username,
                        image:'/user/image/image.jpg',
                        wallPic:'/user/image/wallpic.png',
                        friends:[],
                        online:false,
                        createdOn:Id_info.createdOn,
                        totalTime:0,
                        maxLimit:86402000,
                        todayTime:0,
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
  
//get one login Id requested by client through username
const  check_loginAcc =(username,password)=>
    get_db()
    .then(db=>db.collection('loginCredentials'))
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
            return document
        }
        else{
            console.log('error in password')
            return null
        }
      }
    })
    
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
         console.log('error in finding username ')
         return null
     }  
     else{      
     console.log('user time updated')
             return document
     }
     })
     .catch(err=>{
         console.log('error in finding the account')
         return err
     })
   
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

const change_userPass=(username,newPassword,oldPassword)=>
    get_db()
    .then(db=>db.collection('loginCredentials'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>collection.findOne({username:username}))  
    .then(document=>{
    if(document==null){
        console.log('error in finding username ')
        return false
    }  
    else{      
    console.log('username matched')
            if(document.password===oldPassword)
            {
                document.password=newPassword
                return true
            }
            else{
                return false
            }
    }
    })
    .then(ha=>
        {
            if(ha){
              return get_db()
            }
            else{return false}
        }
    )
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        return false   
    })
    .then(collection=>{
    //  console.log(collection)
        return collection.updateOne(
            { username:username },
            {
            $set: { password :newPassword },
            
            }
        )
    })  
    .catch(err=>{
        console.log('error in finding the account')
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
   

const edit_friendList=(username,friend)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.updateOne(
       { username:username},
        {
            "$addToSet":{
                friends:friend
            }
        }
    ))
    .catch(err=>console.log("error while editing friends list : ",err))

const delete_loginFriend=(username,requester)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.updateOne(
    { username:username},
        {
            "$pull":{
                friends:requester
            }
        }
    ))
    .then(ha=>console.log('user deleted from friends list',ha.message.documents))
    .catch(err=>console.log("error while editing deletes friend from list list : ",err))
//deleting in collection loginIds
const delete_loginAcc=(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.deleteOne({username: new mongodb.ObjectID(username)}))


module.exports={
    get_allLogins,
    check_loginAcc,
    get_loginAcc,
    insert_loginAcc,
    change_userPass,
    delete_loginAcc,
    change_userProfilePic,
    change_userWallPic,
    change_onlineStatus,
    edit_friendList,
    delete_loginFriend,
    change_onlineTime,
    set_appLock
}