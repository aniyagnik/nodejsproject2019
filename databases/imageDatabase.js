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
const get_alluserImgs=(username)=>{
    return get_db()
    .then(db=>db.collection('userImages'))
    .catch(err=>console.log('error in fetching 1'))
    .then(collection=>collection.findOne({username:username}))
    .catch(err=>console.log('error in fetching 2'))
    .then(cursor=>{
       // console.log(cursor.toArray())
        return cursor             
    })
    .catch(err=>console.log('error in fetching '))

}
let updateVal
    //inserting in collection loginIds
const insert_userImgs=(username,image)=>
    get_db()
    .then(db=>db.collection('userImages'))
    .then(collection=>collection.findOne({username:username}))
    .catch(err=>console.log('error in finding username for image '))
    .then(data=>{
        console.log('images ',data,data.images)
        data.images.push(image)
        console.log('images 2',data.images)
        return data.images
     })
     .catch(err=>console.log('error in saving 1'))
    .then(images=>{
        updateVal=images
        console.log('update val : ',updateVal)
        return get_db()})
        .catch(err=>console.log('error in saving 2'))    
    .then(db=>db.collection('userImages'))
    .catch(err=>console.log('error in saving 3'))
    .then(collection=>{
        console.log('updation in process')
        return collection.findOneAndUpdate(
            {    username:username},
            {    $set: {images:updateVal}},
            {    new:true}

        )
    })
    .then(document=>document.value.images)
    .catch(err=>console.log('error in saving 4'))    
   

//deleting in collection loginIds
const delete_userImg=(image)=>
    get_db()
    .then(db=>db.collection('userImages'))
    .then(collection=>collection.deleteOne({username: new mongodb.ObjectID(username)}))


console.log("accessing the database for images")
module.exports={
    get_alluserImgs,
    insert_userImgs,
    delete_userImg
}