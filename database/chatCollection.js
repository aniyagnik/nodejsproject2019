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
        console.log('error in finding username gor chatting showing')
        return null
      }  
      else{      
      console.log('username matched',document)
            return document
      }
})

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

    
const save_unseenChat=(usename,sender,message)=>
    get_db()
    .then(db=>db.collection('chatCollectionforUnseen'))
    .then(collection=>collection.findOneAndUpdate(
        {
            $and:[
                {
                    username:username,
                    chatWith:sender
                }
            ]
        },
        {
            '$push':{
                 unseenMessages:{
                     message
                 }
               }
        },
        { upsert : true }
    ))
    .catch(err=>console.log('err is this : ',err))
module.exports={
    check_chatCollection,
    add_sendChatComment,
    add_recievedChatComment,
    get_userChat,
    save_unseenChat
}    