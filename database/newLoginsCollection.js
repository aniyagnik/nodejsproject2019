const { MongoClient }=require('mongodb')
//var mongoUrl=process.env.MONGOLAB_URI
var mongoUrl="mongodb://project:projectQ12@cluster0-shard-00-00-6zit8.mongodb.net:27017,cluster0-shard-00-01-6zit8.mongodb.net:27017,cluster0-shard-00-02-6zit8.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
client=new MongoClient(mongoUrl || 'mongodb://localhost:27017/project',{ useNewUrlParser: true })
client.connect()
//accessing database testdb and then sending  collection newLoginCollection
const get_db=()=>{       
        const db=client.db('test')
        return new Promise(function(resolve, reject){
            resolve(db);
        });
    }

 
 async function create_newUnactiveLoginAcc (Id_info){
    let value=1
  const resultUser= await get_db()
          .then(db=>db.collection('loginIds'))
          .catch(err=>{
              console.log('error in collection 1')
              return false    
          })
          .then(collection=>collection.findOne({username:Id_info.username}))
          .then(result=>{
              if(result===null)
               {return false}
               else{return true}  
          })
          .catch(err=>{
              console.log('error in collection 2')
              return false   
          })

  const resultEmail= await get_db()
          .then(db=>db.collection('loginIds'))
          .catch(err=>{
              console.log('error in collection 1')
              return false    
          })
          .then(collection=>collection.findOne({email:Id_info.email}))
          .then(result=>{
              if(result===null)
               {return false}
               else{return true}  
          })
          .catch(err=>{
              console.log('error in collection 2')
              return false   
          })
          

    
  console.log('results :::: ')
  console.log(resultUser,resultEmail )
  if(!resultUser && !resultEmail)
  {
      value= await get_db()
              .then(db=>db.collection('newLoginCollection'))
              .then(collection=>{
                  let userDetails={
                      email:Id_info.email,
                      username:Id_info.username,
                      password:Id_info.password,
                      image:'/user/image/image.jpg',
                      wallPic:'/user/image/wallpic.png',
                      friends:[],
                      online:false,
                      createdOn:Id_info.createdOn,
                      totalTime:0,
                      maxLimit:86402000,
                      todayTime:0,
                      active:false
                  }
                  return collection.insertOne(userDetails)})
              .catch(err=>console.log('error in saving collection credentials 1',err))
              .then(doc=>doc.ops[0])
              .catch(err=>console.log('error in saving collectio ids 2',err))
      console.log('awaits ends')
  } 
  else{                
      value=false
  }           
  console.log('value of insertion:',value)
  return value
}    


const get_newUnactiveAccount=(email)=>
    get_db()
    .then(db=>db.collection("newLoginCollection"))
    .then(collection=>collection.findOne({email:email}))
    .then(result=>{
        if(result===null){
            console.log("no account exists in new accounts")
            return false
        }
        else{
            console.log("account found in new accounts ",result)
            return result
        }  
    })


const remove_newAccount=(email)=>
    get_db()
    .then(db=>db.collection('newLoginCollection'))
    .then(collection=>collection.remove({email:email}))
    .then(ha=>{
        console.log('user deleted from new ids',ha.message.documents); 
        return true
    })    
module.exports={
    create_newUnactiveLoginAcc,
    get_newUnactiveAccount,
    remove_newAccount
}