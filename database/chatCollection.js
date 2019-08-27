const {MongoClient}=require('mongodb')
//const client=new MongoClient('mongodb://localhost:27017')
//client.connect()
//accessing database testdb and then sending  collection loginIds
const get_db=()=>{       
      const db=client.db('project')
      return new Promise(function(resolve, reject){
          resolve(db);
      });
  }

async function check_chatCollection(username){
  console.log('in check chat collection')
  let k=await get_db()
  .then(db=>db.collection('chatCollection'))
  .catch(err=>{console.log('error in finding collection',err);return null})
  .then(collection=>{
      console.log('checking...')
      return collection.updateOne(
              {username:username},
              {
                  $setOnInsert:{username:username,chat:[]},
              },
              {upsert:true}
          )
      })
  .catch(err=>{console.log('error in inserting',err);return null})
  console.log('at check chat :',k.result)
  return k
}     


//get one login Id requested by client through username
const  get_userChat =(username,chatWith)=>
    get_db()
    .then(db=>db.collection('chatCollection'))
    .catch(err=>{
        console.log('error in collection')
    })
    .then(collection=>{
      //  console.log(collection)
        return collection.findOne({username:username})
    })  
    .then(document=>{
      if(document==null){
        console.log('no chat showing')
        return null
      }  
      else{      
      console.log('username matched, user reciever chat is',document)
            return document
      }
    })
    .catch(err=>{console.log("username not found in chatCollection",err)})

const add_sendChatComment=(username,chatWith,message)=>
    get_db()
    .then(db=>db.collection('chatCollection'))
    .then(collection=>collection.updateOne(
        {
            $and:[
                  {
                    username:username,
                    chatWith:chatWith
                  }
                ]  
        },
        {
            '$push':{
                  message:{
                      sent:message
                  }
                }
        },
        { upsert : true }
      )
    ) 
    .then(result=>{
        console.log('add_sendChatComment : ',result.message.documents)
        return result
    })
    .catch(err=>{console.log('error in finding username for image ',err)
                        return null
    })    

const add_recievedChatComment=(username,chatWith,message)=>
    get_db()
    .then(db=>db.collection('chatCollection'))
    .then(collection=>collection.findOneAndUpdate(
        {
            $and:[
                  {
                    username:username,
                    chatWith:chatWith
                  }
                ]  
        },
        {
            '$push':{
                  message:{
                      recieve:message
                  }
                }
        },
        { upsert : true }
      )
    ) 

    .then(result=>{
        console.log('add_recievedChatComment : ',result)
        return result
    })
    .catch(err=>{console.log('error in finding username for reciving msg ',err)
                        return null
    })    


async function save_unseenChats(username,sender,message){
  let exists= await get_db()
    .then(db=>db.collection('unseenChatCollection'))
    .then(collection=>collection.findOne({
      $and:[{
        username:username,
        'unseenChats.sender':sender
      }]
    }))

  console.log('sender exists : ',exists)
  if(exists===null)
  {
     let add=await get_db()
        .then(db=>db.collection('unseenChatCollection'))
        .then(collection=>collection.findOneAndUpdate(
            {username:username},
            {
                '$push':{
                      unseenChats:{
                          sender:sender,
                          unseenMessage:'',
                          count:0
                      }
                    }
            },
            { upsert : true }
        )) 
        .then(result=>{
            console.log('save unseenChatComment sub array pushed : ',result)
            return result
        })
        .catch(err=>{console.log('no  username like this exists  for unseen message ',err)
                            return null
        })    
    
  }  
  console.log('adding message to unseen')
  let update= await get_db()
     .then(db=>db.collection('unseenChatCollection'))
     .then(collection=>collection.findOneAndUpdate(
          {
              $and:[
                    {
                      username:username,
                      'unseenChats.sender':sender
                    }
                  ]  
          },
          {
              '$set':{
                    'unseenChats.$.unseenMessage':message 
              }
          },
          {$inc:{'unseenMessages.$.count':1}},
          true
        )
      ) 

      .then(result=>{
          console.log('save_unseenChatComment : ',result)
          return result
      })
      .catch(err=>{console.log('error in finding username for reciving msg ',err)
                          return null
      })    
  console.log('updated value : ',update)
  return true  
}
    
//get one login Id requested by client through username
const  get_unseenUserChats =(username)=>
  get_db()
  .then(db=>db.collection('unseenChatCollection'))
  .catch(err=>{
      console.log('error in collection')
  })
  .then(collection=>collection.findOne({username:username}))  
  .then(document=>{
    if( document===null){
      console.log('no chat for username for chatting showing unssen chat')
      return null
    }  
    else{      
    console.log('username matched,unssen chat are ',document)
          return document.unseenChats
    }
  })

//deleting in collection loginIds
const delete_unseenUserChats=(username,chatWith)=>
  get_db()
  .then(db=>db.collection('chatCollectionForUnseen'))
  .then(collection=>collection.updateOne(
      {
        username:username,
      },
      {
        $pull: { 'unseenChats': { 'sender': chatWith  }}
      }
    )
  )
  .catch(err=>{console.log('err in deleting unseen chat : ',err)})
  

module.exports={
  check_chatCollection,
  add_sendChatComment,
  add_recievedChatComment,
  get_userChat,
  save_unseenChats,
  get_unseenUserChats,
  delete_unseenUserChats
}    


/*


    const save_unseenChats=(username,chatWith,message)=>
    get_db()
    .then(db=>db.collection('chatCollection'))
    .then(collection=>collection.findOneAndUpdate(
        {
            $and:[
                  {
                    username:username,
                    chatWith:chatWith
                  }
                ]  
        },
        {
            '$push':{
                  message:message
            }
        },
        { upsert : true }
      )
    ) 

    .then(result=>{
        console.log('save_unseenChatComment : ',result)
        return result
    })
    .catch(err=>{console.log('error in finding username for reciving msg ',err)
                        return null
    })    


//get one login Id requested by client through username
const  get_unseenUserChats =(username)=>
  get_db()
  .then(db=>db.collection('unseenChatCollection'))
  .catch(err=>{
      console.log('error in collection')
  })
  .then(collection=>collection.find({username:username}))  
  .then(cursor=>cursor.toArray())
  .then(document=>{
    console.log("documents is : ",document)
    if(typeof document.id=='undefined'){
      console.log('no chat for username for chatting showing unssen chat')
      return null
    }  
    else{      
    console.log('username matched,unssen chat are ',document.documents)
          return document.documents
    }
  })

*/