var localImagesArr=require('./localImageset.json');
const {MongoClient} = require('mongodb');
const client = new MongoClient("mongodb://localhost:27017");

connect();
async function connect() {
    try {
    await client.connect();

  
        var db = client.db("thuru");
        const cursor=await  db.collection('ForumPost').find();
       var ind=0;
       var content=[];
        await cursor.forEach(async (res)=>{
            // console.log(ind++);
            if(ind==1){
                if(res.images && res.images.length>0){
                    for (image of res.images) {
                        console.log(image.image);
                    }
                }
            }
         
       
        });

    
    }catch(e){
        console.log(e);
    } finally {
        client.close();
      }
  
}
