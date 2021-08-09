const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017", {
  bufferMaxEntries: 0,
  reconnectTries: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mysql = require(`mysql-await`);
var uniqid = require("uniqid");
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
    var i = 0;
    await client.connect();
    connection.connect();
    var thuru_new_db = client.db("thuru_new");
    // var thuru_db = client.db("thuru_db");
    const postComments = thuru_new_db.collection("PostComments");

    let result = await connection.awaitQuery(
      `SELECT * FROM forum_post_comments fpc, app_users au WHERE fpc.commented_by_id=au.id`
    );

   
    for (el of result) {
      var user = await thuru_new_db
      .collection("User")
      .findOne({ email: el.email });
    var post = await thuru_new_db
      .collection("Post")
      .findOne({ intial_post_id: el.forum_post_id });

      if (user && post) {
        const result = await postComments.insertOne({
          thisUUID: uniqid("postcomments"),
          commentedBy: {
            $ref: "User",
            $id: user._id,
          },
          commentedByUUID: user.thisUUID,
          comment: el.comment,
          post: {
            $ref: "Post",
            $id: post._id,
          },
          postUUID: post.thisUUID,
          isActive: true,
          created_date: new Date(el.commented_dateTime),
        });
      }
      console.log(i++);
    }
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
