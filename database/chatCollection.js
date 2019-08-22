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
   let k=await get_db()
    .then(db=>db.collection('chatCollection'))
    .catch(err=>{console.log('error in finding collection',err);return null})
    .then(collection=>{
        console.log('upadating...')
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
const create_chatInfo=(addChatInfo)=>
     get_db()
     .then(db=>db.collection('chatCollection'))
     .then(collection=>collection.insertOne(addChatInfo))
     .catch(err=>console.log('error in saving collectio ids 1',err))
     .then(doc=>{
         console.log('inserted values is :',doc.ops[0])
         return doc.ops[0]
     })
     .catch(err=>console.log('error in saving collectio ids 2',err))    

const add_sendChatComment=(username,chatWith,message)=>
    get_db()
    .then(db=>db.collection('chatCollection'))
    .then(collection=>collection.findOneAndUpdate(
        {
            username:username,
            'chat.chatWith':chatWith
        },
        { 
            $setOnInsert:{},
            '$push': { 
            messages:{ 
                "send":message
              } 
            }
        }
      )
    ) 
    .catch(err=>{console.log('error in finding username for image ',err)
                       return null
    })    


    const add_recievedChatComment=(username,chatWith,message)=>
    get_db()
    .then(db=>db.collection('chatCollection'))
    .then(collection=>collection.findOneAndUpdate(
        {
            username:username,
            'chat.chatWith':chatWith
        },
        { '$push': { 
            messages:{ 
                "recieve":message
              } 
            }
        }
      )
    ) 
    .catch(err=>{console.log('error in finding username for image ',err)
                       return null
    })    

    
const save_unseenChat=(sender,reciever,message)=>
    get_db()
    .then(db=>db.collection('chatCollection'))
    .then(collection=>collection.findOneAndUpdate(
        {
            sender:sender,
            'chat.reciever':reciever
        },
        {
            '$push':{
                "chat.message":message
               }
        }

    ))
module.exports={
    check_chatCollection,
    add_sendChatComment,
    add_recievedChatComment
}    