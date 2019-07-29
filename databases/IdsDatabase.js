const { MongoClient }=require('mongodb')
const client=new MongoClient('mongodb://localhost:27017')

//accessing database testdb and then sending  collection loginIds
const get_db=()=>client.connect()
    .then(()=>{
        const db=client.db('testdb')
       console.log(`database accessed`)
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


//get one login Id requested by client through username
const  check_loginAcc =(username,password)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
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
        {console.log('pASSWORD MATHCED')
            return document}
        else{
            console.log('error in password')
            return null
        }
      }
    })


//get one login Id requested by client through username
const  get_loginAcc =(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
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

    //inserting in collection loginIds
const insert_loginAcc=(Id_info)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>{
        console.log('item saved')
         collection.insertOne(Id_info,function (error, response) {
            if(error) {
                console.log('Error occurred while inserting');
               return null
            } else {
              // console.log('inserted record', response.ops[0]);
              return response.ops[0]
            }
        })
    })
     .catch(err=>console.log('error in saving '))


//deleting in collection loginIds
const delete_loginAcc=(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.deleteOne({username: new mongodb.ObjectID(username)}))


console.log("accessing the database for ids")
module.exports={
    get_allLogins,
    check_loginAcc,
    get_loginAcc,
    insert_loginAcc,
    delete_loginAcc
}