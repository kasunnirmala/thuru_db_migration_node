const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017", {
  bufferMaxEntries: 0,
  reconnectTries: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var uniqid = require("uniqid");
var pointTable = [
  [1, [0.01, 0.01, 0.0, 0.0]],
  [6, [0.05, 0.03, 0.01, 0.01]],
  [1 * 12, [0.1, 0.05, 0.03, 0.01]],
  [2 * 12, [0.2, 0.2, 0.05, 0.03]],
  [3 * 12, [0.3, 0.15, 0.08, 0.04]],
  [4 * 12, [0.4, 0.2, 0.1, 0.05]],
  [5 * 12, [0.5, 0.25, 0.13, 0.06]],
  [6 * 12, [0.6, 0.3, 0.15, 0.08]],
  [7 * 12, [0.7, 0.35, 0.18, 0.09]],
  [8 * 12, [0.8, 0.4, 0.2, 0.1]],
  [9 * 12, [0.9, 0.45, 0.23, 0.11]],
  [10 * 12, [1.0, 0.5, 0.25, 0.13]],
  [15 * 12, [1.5, 0.75, 0.38, 0.19]],
  [20 * 12, [2.0, 1.0, 0.5, 0.25]],
];

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
    const oxygen_release = thuru_new_db.collection("OxygenRelease");
    const tree_category = thuru_new_db.collection("TreeCategory");
    const cursor = await tree_category.find();
    var ind = 0;
    await cursor.forEach(async (res) => {
     
        pointTable.forEach(async (points)=>{
            const result = await oxygen_release.insertOne({
                months: points[0],
                point: points[1][ind],
                category: {
                  $ref: "TreeCategory",
                  $id: res._id,
                },
                categoryUUID: res.thisUUID,
                thisUUID: uniqid("OxygenRelease"),
              });
        
        });
     
      console.log(ind++);
    });
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
