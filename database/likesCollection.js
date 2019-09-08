const { MongoClient }=require('mongodb')
//const client=new MongoClient('mongodb://localhost:27017')
//accessing database testdb and then sending  collection loginIds
const get_db=()=>{       
        const db=client.db('test')
        return new Promise(function(resolve, reject){
            resolve(db);
        });
    }

//accessing collection to get image likes
const get_imageLikes=(username,imageName)=>{
    return get_db()
    .then(db=>db.collection('likesCollection'))
    .catch(err=>console.log('error in fetching 1'))
    .then(collection=>
        collection.findOne({
            $and: [
                   {username:username},
                   {imageName:imageName}
                  ]
             }
        )
    )
    .catch(err=>console.log('error in fetching 2'))
    .then(cursor=>{
        console.log('likes got:',cursor)
        return cursor             
    })
    .catch(err=>console.log('error in fetching '))

}
 
//inserting in collection
const add_imageLikes=(username,imageName,likedBy)=>
    get_db()
    .then(db=>
        db.collection('likesCollection').findOneAndUpdate(
            { 
                username:username,
                imageName:imageName 
            
            },
            { 
                '$push': { likes:likedBy} 
            },
            { upsert: true }
        )
    )
    .then(r=>{console.log('like added ',r)
            return null})
    .catch(err=>{console.log('error in finding username for adding image likes ',err)
                       return null
    })
    

//deleting in collection 
const remove_like=(username,imageName,likedBy)=>
    get_db()
    .then(db=>db.collection('likesCollection'))
    .then(collection=>collection.updateOne(
        {
            $and:[{
                username:username,
                imageName:imageName
            }] 
        },    
        {
             $pull: { likes:{ $in:[likedBy]}}
        },
        { multi: true }
      )
    )
    .then(r=>{console.log('like removed ',r.result)
            return null})
    .catch(err=>{console.log('error in finding username for removing image likes ',err)
            return null
    })        


module.exports={
    get_imageLikes,
    add_imageLikes,
    remove_like
}