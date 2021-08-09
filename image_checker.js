var localImagesArr=require('./localImageset.json');
var images=require('./images.json');
const {MongoClient} = require('mongodb');
// var fs=require("fs")
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
            console.log(ind++);
         var imgSet=images.filter(object => object.id==res._id.toString());
         if(imgSet && imgSet.length>0){
                  var filtered = imgSet[0].images.filter(function (el) {
                return el != null;
              });
            //  
              res.images=filtered;
            //   console.log(res);
              const result = await db.collection('ForumPost').save(res);
            }
       
        });

    
    }catch(e){
        console.log(e);
    } finally {
        client.close();
      }
  
}
