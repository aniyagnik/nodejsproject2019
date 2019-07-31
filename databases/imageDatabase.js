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
const insert_userImgs=(username,filename,description)=>
    get_db()
    .then(db=>
        db.collection('userImages').findOneAndUpdate(
            {username:username},
            { '$push': { images: 
                { 
                    image:filename,
                    description:description
                  } 
                }
            },
            { new: true },
            function (err, documents) {
                console.log("document after insertion",documents,documents.value.images)
                return documents.value.images ;
            }
        )
    )
    .catch(err=>{console.log('error in finding username for image ',err)
                       return null
    })
    

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