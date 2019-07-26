const { MongoClient }=require('mongodb')
const client=new MongoClient('mongodb://localhost:27017')

//accessing database testdb and then sending  collection loginIds
const get_db=()=>client.connect()
    .then(()=>{
        const db=client.db('testdb')
       console.log(`database made`)
        return db
    })


//accessing collection loginAcc
const get_allLogins=()=>{
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>console.log('error in fetching 1'))
    .then(collection=>collection.find())
    .catch(err=>console.log('error in fetching 2'))
    .then(cursor=>cursor.toArray())
    .catch(err=>console.log('error in fetching '))

}

//get one login Id requested by client through username
const  get_loginAcc =(username,password)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in finding username 1')
        res.send('error1')    
    })
    .then(collection=>{
        //console.log(collection)
        return collection.findOne({username:username})})
     .catch(err=>{
        console.log('error in finding username 2')
        return null    
    })   
    .then(document=>{console.log('username matched')
      //console.log('document : ',document)  
      if(document.password===password)
        {console.log('pASSWORD MATHCED')
            return document}
        else{
            console.log('error in password')
            return null
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
               console.log('inserted record', response.ops[0]);
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

get_db()
console.log("accessing the database for ids")
module.exports={
    get_allLogins,
    get_loginAcc,
    insert_loginAcc,
    delete_loginAcc
}