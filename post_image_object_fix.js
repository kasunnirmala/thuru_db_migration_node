const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017", {
  bufferMaxEntries: 0,
  reconnectTries: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




connect();
async function connect() {
  try {
    await client.connect();
   
    var thuru_new_db = client.db("thuru_new");
    const post = thuru_new_db.collection("Post");
    const cursor = await post.find();
    var ind = 0;
    await cursor.forEach(async (res) => {
    //   console.log(ind++);
      var newImgArr = [];
      if ( res.images) {
          if(typeof res.images[0]== 'object'){
        //   console.log(res.images[0]);
        console.log(ind++);
        res.images.forEach((im) => {
          newImgArr.push("images/" + (im._id)+ ".jpeg");
        });
        res.images = newImgArr;
        const result = await post.save(res);
      }
    }
    });
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
