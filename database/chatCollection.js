const {MongoClient}=require('mongodb')
const client=new MongoClient('mongodb://localhost:27017')


//accessing database testdb and then sending  collection loginIds
const get_db=()=>client.connect()
    .then(()=>{
        const db=client.db('project')
       console.log(`database accessed for accessing ids collection`)
        return db
    })

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

const add_chatComment=(chatters,chatBy,message)=>
    get_db()
    .then(db=>db.collection('chatCollection'))
    .then(collection=>collection.findOneAndUpdate(
        {chat:chatters},
        { '$push': { chat: 
            { 
                chatBy:chatBy,
                message:message
              } 
            }
        }
      )
    ) 
    .catch(err=>{console.log('error in finding username for image ',err)
                       return null
    })    


module.exports={
    create_chatInfo,
    add_chatComment,
}    