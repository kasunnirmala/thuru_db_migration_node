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
      var i=0;
    await client.connect();
    connection.connect();
    var thuru_new_db = client.db("thuru_new");
    // var thuru_db = client.db("thuru_db");
    const group = thuru_new_db.collection("Group");
    
    let result = await connection.awaitQuery(
      `SELECT * FROM training_group`
    );

    var user = await thuru_new_db
    .collection("User")
    .findOne({ username: "admin"});
   
    for (el of result) {

      const result = await group.insertOne({
        thisUUID: uniqid("group"),
        groupAdmin: {
          $ref: "User",
          $id: user._id,
        },
        groupAdminUUID:user.thisUUID,
        groupName:el.name,
        groupDescription: el.description,
        objective: el.objective,
        contact:el.contactNo,
        contactPerson: el.contactPerson,
        image: el.image_name,
        active: true,
        locked: false,
        created_date:new Date(el.updated_at),
      });

      console.log(i++);
    };

  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
