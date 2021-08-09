const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017", {
  bufferMaxEntries: 0,
  reconnectTries: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var uniqid = require("uniqid");
var pointTable = [
  [1, [2, 1, 1, 0]],
  [6, [4, 2, 1, 1]],
  [1 * 12, [6, 3, 2, 1]],
  [2 * 12, [8, 4, 2, 1]],
  [3 * 12, [10, 5, 3, 1]],
  [4 * 12, [12, 6, 3, 2]],
  [5 * 12, [14, 7, 4, 2]],
  [6 * 12, [16, 8, 4, 2]],
  [7 * 12, [18, 9, 5, 2]],
  [8 * 12, [20, 10, 5, 3]],
  [9 * 12, [22, 11, 6, 3]],
  [10 * 12, [24, 12, 6, 3]],
  [15 * 12, [32, 16, 8, 4]],
  [20 * 12, [40, 20, 10, 5]],
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
    const points_collection = thuru_new_db.collection("Points");
    const tree_category = thuru_new_db.collection("TreeCategory");
    const cursor = await tree_category.find();
    var ind = 0;
    await cursor.forEach(async (res) => {
      pointTable.forEach(async (points) => {
        const result = await points_collection.insertOne({
          months: points[0],
          point: points[1][ind],
          category: {
            $ref: "TreeCategory",
            $id: res._id,
          },
          categoryUUID: res.thisUUID,
          thisUUID: uniqid("Points"),
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
