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

const create_newGroup=()=>
get_db()
.then(db=>db.collection("groupcollection"))
.then(collection=>{ 
  const group={
    createdBy:createdBy,
    timeCreated:time,
    groupName:groupName,
    groupId:"Ads",
    groupPic:"/user/image/wallpic.png",
    members:members
  }
  return collection.insertOne(group)})
.then(doc=>console.log("created groupt is : ",doc))
.catch(err=>console.log("error 1 in creating group :",err)) 

 
const change_groupPic=(username,filename)=>
    get_db()
    .then(db=>db.collection('groupCollection'))
    .catch(err=>{
        console.log('error in collection')
        res.send('error1')    
    })
    .then(collection=>{
        return collection.updateOne(
            { username:username },
            {
            $set: { "groupImage": filename },
            }
        )
    })  
    .then(document=>{
    if(document==null){
        console.log('error in finding group ')
        return null
    }  
    else{      
    console.log('group matched')
            return document
    }
    })
    .catch(err=>{
        console.log('error in finding the group')
        return err
    })


module.exports={create_newGroup,change_groupPic}