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
    const user = thuru_new_db.collection("User");
    const cursor = await user.find();
    var ind = 0;
    await cursor.forEach(async (res) => {
      console.log(ind++);

      res.active = true;
      const result = await user.save(res);
    });
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
