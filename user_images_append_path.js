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
    const user = thuru_new_db.collection("User");
    const cursor = await user.find();
    var ind = 0;
    await cursor.forEach(async (res) => {
      console.log(ind++);
      if (res.profileImage) {
        res.profileImage =
         "images/"+ res.profileImage;
        const result = await user.save(res);
      }
    });
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
