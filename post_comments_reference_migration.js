const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017", {
  bufferMaxEntries: 0,
  reconnectTries: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mysql = require(`mysql-await`);
var connection = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "thuru",
});

connect();
async function connect() {
  try {
    await client.connect();
    connection.connect();
    var thuru_new_db = client.db("thuru_new");
    const postComments = thuru_new_db.collection("PostComments");
    const cursor=await postComments.find();
    var ind=0;
     await cursor.forEach(async (res)=>{
         console.log(ind++);
         var post = await await thuru_new_db
         .collection("Post")
         .findOne({ thisUUID: res.postUUID });
         var user = await thuru_new_db
         .collection("User")
         .findOne({ thisUUID: res.commentedByUUID });

        //  username,firstname,lastname, userUUID,userImage,comment,commentUUID,commenttimestamp
    post.comments.push([user.username,user.firstName,user.lastName,user.thisUUID,"images/"+user.profileImage,res.comment,res.thisUUID,new Date(res.created_date).valueOf()/1000]);
           const result = await thuru_new_db.collection("Post").save(post);
        
    
     });

  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
