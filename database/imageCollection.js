const { MongoClient }=require('mongodb')
//const client=new MongoClient('mongodb://localhost:27017')
//client.connect()
//accessing database testdb and then sending  collection loginIds
const get_db=()=>{       
        const db=client.db('test')
        return new Promise(function(resolve, reject){
            resolve(db);
        });
    }

//accessing collection for checking a loginAcc
const get_alluserImgs=(username)=>{
    return get_db()
    .then(db=>db.collection('userImages'))
    .catch(err=>console.log('error in fetching 1',err))
    .then(collection=>collection.findOne({username:username}))
    .catch(err=>console.log('error in fetching 2',err))
    .then(cursor=>{
        return cursor             
    })
    .catch(err=>console.log('error in fetching ',err))

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
            }
        )
    )
    .catch(err=>{console.log('error in finding username for image ',err)
                       return null
    })
    .then(value=>{
       // console.log('in insert image mongodb :: ',value)
        return get_db()})
    .then(db=>
        db.collection('userComments').insertOne(
            {
                username:username,
                image:filename,
                comments:[]
            },
            function (error, response) {
                if(error) {
                    console.log('Error occurred while inserting comment array');
                    return null
                } else {
                console.log('inserted record for image comments:', response.ops[0]);
                return response.ops[0]
                }
            }           
        )
    )
    .catch(err=>{console.log('error in finding username for image ',err)
                       return null
    })

    

//deleting in collection loginIds
const delete_userImg=(username,image)=>
    get_db()
    .then(db=>db.collection('userImages'))
    .then(collection=>collection.updateOne(
        {username:username},
        {
             $pull: { images: { image: image  }}
        }
      )
    )


module.exports={
    get_alluserImgs,
    insert_userImgs,
    delete_userImg
}