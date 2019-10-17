const {MongoClient}=require('mongodb')
//const client=new MongoClient('mongodb://localhost:27017')
//client.connect()
//accessing database testdb and then sending  collection loginIds
const {change_activeStatus}=require('./IdsCollection.js')

const get_db=()=>{       
      const db=client.db('test')
      return new Promise(function(resolve, reject){
          resolve(db);
      });
}

const add_newHash=(hash)=>
    get_db()
    .then(db=>db.collection("hashCollection"))
    .then(collection=>{
        const doc={
            hash:hash
        }
        collection.insertOne(doc)})
    .then(val=>console.log('inserted hash : ',val))
    .catch(err=>console.log("error in saving hash ",err))

// const remove_hash=(hash)=>
//     get_db()
//     .then(db=>db.collection('hashCollection'))
//     .then(collection=>collection.remove({hash:hash}))
//     .then(ha=>{
//         console.log('user deleted',ha.message.documents); 
//         return true
//     })
//     .catch(err=>{console.log('err in deleting unseen chat : ',err)})

const  verify_emailId =(hash)=>
    get_db()
    .then(db=>db.collection('hashCollection'))
    .catch(err=>{
        console.log('error in collection')
        return false    
    })
    .then(collection=>collection.findOne({hash:hash}))  
    .then(document=>{
      if(document==null){
        console.log('error in finding userEmail ')
        return false
      }  
      else{      
      console.log('userEmail verified from collection')
      return get_db()
      }
    })
    .then(db=>db.collection('hashCollection'))
    .then(collection=>collection.remove({hash:hash}))
    .then(ha=>{
        console.log('user deleted',ha.message.documents); 
        return true
    })
    .then(as=>change_activeStatus)
    .then(ha=>{
        console.log('active status changed'); 
        return true
    })
    .catch(err=>{
        console.log('error in changing status',err)
        return false    
    })

module.exports={
    add_newHash,
   // remove_hash,
    verify_emailId
}    

