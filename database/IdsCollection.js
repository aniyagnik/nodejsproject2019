const { MongoClient }=require('mongodb')
const client=new MongoClient('mongodb://localhost:27017')

//accessing database testdb and then sending  collection loginIds
const get_db=()=>client.connect()
    .then(()=>{
        const db=client.db('project')
       console.log(`database accessed for accessing ids collection`)
        return db
    })


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
    const result= await get_db()
                        .then(db=>db.collection('loginIds'))
                        .catch(err=>{
                            console.log('error in collection 1')
                            return null    
                        })
                        .then(collection=>collection.findOne({username:Id_info.username}))
                        .catch(err=>{
                            console.log('error in collection 2')
                            return null    
                        })

      
    console.log('result :::: ',result )
    if(!result)
    {
        value= await get_db()
                .then(db=>db.collection('userImages'))
                .catch(err=>console.log('error in accessing in collection images '))
                .then(collection=>{
                    add={username:Id_info.username,
                        images:[]
                    }
                    console.log("added file :",add)
                    collection.insertOne(add)
                    return true
                })
                .catch(err=>console.log('error in saving in collection images '))
                .then(ha=>get_db())
                .then(db=>db.collection('loginIds'))
                .then(collection=>collection.insertOne(Id_info))
                .catch(err=>console.log('error in saving collectio ids 1',err))
                .then(doc=>{
                    console.log('inserted values is :',doc.ops[0])
                    return doc.ops[0]
                })
                .catch(err=>console.log('error in saving collectio ids 2',err))
        console.log('awaits ends')
    } 
    else{                
        value=null
    }           
    console.log('value of insertion:',value)
    return value
}    

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
            change_onlineStatus(document.username)
            return document
        }
        else{
            console.log('error in password')
            return 'k'
        }
      }
    })
    
const change_onlineStatus=(username)=>
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
             $set: { online: true },
             
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
    .then(db=>db.collection('loginIds'))
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
   


//deleting in collection loginIds
const delete_loginAcc=(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.deleteOne({username: new mongodb.ObjectID(username)}))


const edit_onlineStatus=(username)=>
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
            $set: { online: !online },
            
            }
        )
    })  
    .then(document=>{
    if(document==null){
        console.log('error in finding username ')
        return null
    }  
    else{      
    console.log('username matched online satus edited')
            return document
    }
    })
    .catch(err=>{
        console.log('error in finding the account')
        return err
    })

console.log("accessing the collection for ids")
module.exports={
    get_allLogins,
    check_loginAcc,
    get_loginAcc,
    insert_loginAcc,
    change_userPass,
    delete_loginAcc,
    change_userProfilePic,
    change_userWallPic,
    edit_onlineStatus
}