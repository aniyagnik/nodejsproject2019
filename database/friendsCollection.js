const {MongoClient}=require('mongodb')
//const client=new MongoClient('mongodb://localhost:27017')
//client.connect()
const  {get_allLogins,check_loginAcc,get_loginAcc,edit_friendList}=require('./IdsCollection')
//accessing database testdb and then sending  collection friendReqCollection
const get_db=()=>{       
      const db=client.db('test')
      return new Promise(function(resolve, reject){
          resolve(db);
      });
  }
let pic

const insert_recievedfriendRequest=(username,reqSender)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.findOneAndUpdate(
        {username:username},
        {
            '$push':{
              requestsRecieved:reqSender,
              }
        },
        {new:true},
        { upsert : true }
    )) 
    .then(result=>{
        console.log('insert recieved friends request pushed  ',result)
        return result
    })
    .catch(err=>{console.log('no  username like this exists  for friend request ',err)
        return null
    })    



  //get one login Id requested by client through username
const  get_recievedfriendRequest =(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
    })
    .then(collection=>collection.findOne({username:username}))  
    .then(document=>{
      if( document===null){
        console.log('no request for username to show')
        return null
      }  
      else{      
      console.log('username matched,recieved request available ',document.requestsRecieved)
            return document.requestsRecieved
      }
    })


const delete_recievedfriendRequest=(username,reqSender)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.updateOne(
        {
          username:username,
        },
        {
          $pull: { 'requestsRecieved':reqSender}
        }
      )
    )
    .then(ha=>{console.log('recievedfrd req deleted',ha.message.documents)})
    .catch(err=>{console.log('err in deleting friend req : ',err)})
    

const insert_sendfriendRequest=(username,reqSender)=>
     get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.findOneAndUpdate(
        {username:username},
        {
            '$push':{
              requestsSend:reqSender,
              }
        },
        {new:true},
        { upsert : true }
    )) 
    .then(result=>{
        console.log('insert friendsreq send array pushed  ',result)
        return result
    })
    .catch(err=>{console.log('no  username like this exists  for friend request ',err)
        return null
    })    



  //get one login Id requested by client through username
const  get_sendfriendRequest =(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
    })
    .then(collection=>collection.findOne({username:username}))  
    .then(document=>{
      if( document===null){
        console.log('no request for username to show')
        return null
      }  
      else{      
      console.log('username matched,send request available ',document.requestsSend)
            return document.requestsSend
      }
    })


const delete_sendfriendRequest=(username,reqSender)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.updateOne(
        {
          username:username,
        },
        {
          $pull: { 'requestsSend':reqSender}
        }
      )
    )
    .then(ha=>{console.log('send frd req deleted',ha.message.documents)})
    .catch(err=>{console.log('err in deleting friend req : ',err)})
        

const  insert_friendInList =(username,requester)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.findOneAndUpdate(
        {username:username},
        {
            '$push':{
              friends:requester,
              }
        },
        { upsert : true }
    )) 
    .then(result=>{
        console.log('insert friendsreq recieved array pushed  ',result)
        return result
    })
    .catch(err=>{console.log('no  username like this exists  for friend request ',err)
        return null
    })    



  //get one login Id requested by client through username
const  get_friendsInList =(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
    })
    .then(collection=>collection.findOne({username:username}))  
    .then(document=>{
      if( document===null){
        console.log('no request for username to show')
        return null
      }  
      else{      
      console.log('username matched,getting the friends list ',document.friends)
            return document.friends
      }
    })

 const delete_friendInList=(username,reqSender)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.updateOne(
        {username:username},
        {
        $pull: { 'friends': reqSender}
        }
    )
    )
    .then(ha=>{console.log('user deleted from frinds',ha.message.documents);return true})
    .catch(err=>console.log('err in deleting friend : ',err))
 

const get_profilePic=(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.findOne({username:username}))    
    .then(ha=>{
      console.log('user founded in profilepic',ha.username)
      return {
        username:username,
        profilePic:ha.image
      }
    })
    .catch(err=>console.log('err in getting profile : ',err))

module.exports={
  insert_recievedfriendRequest,
  get_recievedfriendRequest,
  delete_recievedfriendRequest,
  insert_sendfriendRequest,
  get_sendfriendRequest,
  delete_sendfriendRequest,
  insert_friendInList,
  get_friendsInList,
  delete_friendInList,
  get_profilePic
}    