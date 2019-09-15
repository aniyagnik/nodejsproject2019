const {MongoClient}=require('mongodb')
//const client=new MongoClient('mongodb://localhost:27017')
//client.connect()
const  {get_allLogins,check_loginAcc,get_loginAcc,insert_loginAcc,change_userPass,delete_loginAcc,change_userProfilePic,change_onlineStatus,change_userWallPic}=require('./IdsCollection')
//accessing database testdb and then sending  collection friendReqCollection
const get_db=()=>{       
      const db=client.db('test')
      return new Promise(function(resolve, reject){
          resolve(db);
      });
  }
let pic

const insert_friendRequest=(username,reqSender)=>
    get_loginAcc(reqSender)
    .then(doc=>{pic=doc.image
      return get_db()
    })
    .then(db=>db.collection('friendReqCollection'))
    .then(collection=>collection.findOneAndUpdate(
        {username:username},
        {
            '$addToSet':{requests:{
              reqSender:reqSender,
              profilePic:pic
            }}
        },
        { upsert : true }
    )) 
    .then(result=>{
        console.log('insert friendReqCollection sub array pushed  ',result)
        return result
    })
    .catch(err=>{console.log('no  username like this exists  for friend request ',err)
                        return null
    })    



  //get one login Id requested by client through username
  const  get_friendRequest =(username)=>
    get_db()
    .then(db=>db.collection('friendReqCollection'))
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
      console.log('username matched,request available ',document)
            return document.requests
      }
    })
  
  //deleting in collection loginIds
const delete_friendRequest=(username,reqSender)=>
    get_db()
    .then(db=>db.collection('friendReqCollection'))
    .then(collection=>collection.updateOne(
        {
          username:username,
        },
        {
          $pull: { 'requests':{reqSender:reqSender}}
        }
      )
    )
    .then(ha=>{console.log('frd req deleted',ha.message.documents)})
    .catch(err=>{console.log('err in deleting friend req : ',err)})
    

const add_friend=(username,requester)=>
  get_loginAcc(requester)
  .then(doc=>{pic=doc.image
    return get_db()
  })
    .then(db=>db.collection('friendsCollection'))
    .then(collection=>collection.findOneAndUpdate(
        {username:username},
        {
          '$addToSet':{friends:{
            friend:requester,
            profilePic:pic
          }}
        },
        { upsert : true }
    )) 
    .then(result=>{
        console.log('insert friendsCollection array pushed  ')
        return result
    })
    .catch(err=>{console.log('no  username like this exists  for friends ',err)
        return null
    })    

const  get_friends =(username)=>
    get_db()
    .then(db=>db.collection('friendsCollection'))
    .catch(err=>{
        console.log('error in collection')
    })
    .then(collection=>collection.findOne({username:username}))  
    .then(document=>{
      if( document===null){
        console.log('no friends for username to show')
        return null
      }  
      else{      
      console.log('username matched,friends are available ',document)
            return document.friends
      }
    }) 
 //deleting in collection loginIds
 const delete_friend=(username,reqSender)=>
    get_db()
    .then(db=>db.collection('friendsCollection'))
    .then(collection=>collection.updateOne(
        {
        username:username,
        },
        {
        $pull: { 'requests': {reqSender:reqSender}}
        }
    )
    )
    .then(ha=>{console.log('user deleted',ha.message.documents)})
    .catch(err=>{console.log('err in deleting unseen chat : ',err)})
 
module.exports={
    insert_friendRequest,
    get_friendRequest,
    delete_friendRequest,
    add_friend,
    get_friends,
    delete_friend
}    