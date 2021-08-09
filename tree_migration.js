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
    const tree = thuru_new_db.collection("Tree");
    // await tree.insertOne({tree:"AAA"});

    let result = await connection.awaitQuery(
      "SELECT * FROM trees tr,app_users au,category c WHERE tr.category_id=c.id and tr.created_by_id=au.id"
    );

      for (el of result) {

      var treeCategory = await thuru_new_db
        .collection("TreeCategory")
        .findOne({ metaCode: el.metacode});
        var user = await thuru_new_db
        .collection("User")
        .findOne({ email: el.email});

      const result = await tree.insertOne({
        thisUUID: uniqid("tree"),
        category: {
          $ref: "TreeCategory",
          $id: treeCategory._id,
        },
        categoryUUID: treeCategory.thisUUID,
        localName: el.localName,
        englishName: el.englishName,
        scientificName:el.scientificName,
        created_date: new Date(el.createdDateTime),
        approved: true,
        status: true,
        isRare:Boolean(el.is_rare_tree),
        createdBy:{
          $ref: "User",
          $id: user._id,
        },
        createdByUUID:user.thisUUID,
        updatedBy:{
          $ref: "User",
          $id: user._id,
        },
        updatedByUUID:user.thisUUID,
      });

      console.log(i++);
    };

    // console.log(result);

  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
