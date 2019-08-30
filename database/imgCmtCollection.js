const { MongoClient }=require('mongodb')
//const client=new MongoClient('mongodb://localhost:27017')
//accessing database testdb and then sending  collection loginIds
const get_db=()=>{       
        const db=client.db('test')
        return new Promise(function(resolve, reject){
            resolve(db);
        });
    }

//accessing collection for checking a loginAcc
const get_allComments=(userWall,imageName)=>{
    return get_db()
    .then(db=>db.collection('userComments'))
    .catch(err=>console.log('error in fetching 1'))
    .then(collection=>
        collection.findOne({
            $and: [
                   {username:userWall},
                   {image:imageName}
                  ]
             }
        )
    )
    .catch(err=>console.log('error in fetching 2'))
    .then(cursor=>{
        console.log('comments got:',cursor)
        return cursor.comments             
    })
    .catch(err=>console.log('error in fetching '))

}
let updateVal
    //inserting in collection loginIds
const insert_comment=(username,imageName,cmntdBy,comment,tagged)=>
    get_db()
    .then(db=>
        db.collection('userComments').findOneAndUpdate(
            { 
                username:username,
                image:imageName 
            
            },
            { '$push': { comments: 
                { 
                    commentBy:cmntdBy,
                    tagged:tagged,
                    comment:comment
                  } 
                }, 
            },
            { new: true }
        )
    )
    .catch(err=>{console.log('error in finding username for image ',err)
                       return null
    })
    

//deleting in collection loginIds
const delete_comment=(image)=>
    get_db()
    .then(db=>db.collection('userComments'))
    .then(collection=>collection.deleteOne({username: new mongodb.ObjectID(username)}))


module.exports={
    get_allComments,
    insert_comment,
    delete_comment
}