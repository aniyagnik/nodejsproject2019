const {MongoClient}=require('mongodb')
//const client=new MongoClient('mongodb://localhost:27017')
//client.connect()
//accessing database testdb and then sending  collection loginIds
const get_db=()=>{       
      const db=client.db('test')
      return new Promise(function(resolve, reject){
          resolve(db);
      });
}

const add_newHash=(userEmail,hash)=>
    get_db()
    .then(db=>db.collection("hashCollection"))
    .then(collection=>{
        const doc={
            userEmail:userEmail,
            hash:hash
        }
        return collection.insertOne(doc)
    })
    .catch(err=>console.log("error in saving hash ",err))

const remove_hash=(userEmail)=>
    get_db()
    .then(db=>db.collection('hashCollection'))
    .then(collection=>collection.remove({userEmail:userEmail})
    )
    .then(ha=>{console.log('user deleted',ha.message.documents)})
    .catch(err=>{console.log('err in deleting unseen chat : ',err)})

const  verify_emailId =(userEmail,hash)=>
    get_db()
    .then(db=>db.collection('hashCollection'))
    .catch(err=>{
        console.log('error in collection')
        return null    
    })
    .then(collection=>{
       // console.log(collection)
        return collection.findOne({userEmail:userEmail})
    })  
    .then(document=>{
      if(document==null){
        console.log('error in finding userEmail ')
        return null
      }  
      else{      
      console.log('userEmail matched')
      //console.log('document : ',document)  
      if(document.hash===hash)
        {
            console.log('hash MATHCED')
            return document
        }
        else{
            console.log('error in hash')
            return null
        }
      }
    })

module.exports={
    add_newHash,
    remove_hash,
    verify_emailId
}    

