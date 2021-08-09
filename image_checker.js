var localImagesArr=require('./localImageset.json');
const {MongoClient} = require('mongodb');
// var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");

var fs=require("fs")
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
           
            if(res.images && res.images.length>0){

              
               
    //             // if(ind==1111){
    //                 console.log(ind);
                var imgs=[];
               res.images.forEach(async i=>{
                // console.log(i);   
               imgs.push(i._id);
               });        

               content.push({id:res._id.toString(),images:imgs});
             
            //    res.images=imgs;
            //    const result = await db.collection('ForumPost').save(res);
            //    const result = await db.collection('ForumPost').updateOne({id:res.id}, {$set:{images:imgs}});
            //    console.log(result);   
            //    console.log(res);    
              console.log(ind++);
    // }
    // ind++;
}
   
        });

        fs.writeFileSync("images.txt",JSON.stringify(content));
 
    }catch(e){
        console.log(e);
    } finally {
        client.close();
      }
  
}
