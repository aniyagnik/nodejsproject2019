const { MongoClient }=require('mongodb')
const client=new MongoClient('mongodb://localhost:27017')

//accessing database testdb and then sending  collection loginIds
const get_db=()=>client.connect()
    .then(()=>{
        const db=client.db('project')
       console.log(`database accessed for accessing ids collection`)
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

 //inserting in collection loginIds
 const insert_loginAcc=(Id_info)=>
    get_db()
    .then(db=>db.collection('userImages'))
    .catch(err=>console.log('error in accessing in collection images '))
    .then(collection=>{
        add={username:Id_info.username,
            images:[]
        }
        console.log("added file :",add)
        collection.insertOne(add)
        return true
    })
    .catch(err=>console.log('error in saving in collection images '))
    .then(ha=>get_db())
    .then(db=>db.collection('loginIds'))
    .then(collection=>{
        console.log('item saved in insert id')
        get_db()
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
    .catch(err=>console.log('error in saving collectio ids'))

//get one login Id requested by client through username
const  check_loginAcc =(username,password)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        return null    
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
const update_loginAcc=(username,password)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>{
    //  console.log(collection)
        return collection.updateOne(
            { username:'username' },
            {
              $set: { "password": password, status: "P" },
              
            }
         )
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
    .catch(err=>{
        console.log('error in finding the account')
        return done(err)
    })



//deleting in collection loginIds
const delete_loginAcc=(username)=>
    get_db()
    .then(db=>db.collection('loginIds'))
    .then(collection=>collection.deleteOne({username: new mongodb.ObjectID(username)}))


console.log("accessing the collection for ids")
module.exports={
    get_allLogins,
    check_loginAcc,
    get_loginAcc,
    insert_loginAcc,
    update_loginAcc,
    delete_loginAcc
}