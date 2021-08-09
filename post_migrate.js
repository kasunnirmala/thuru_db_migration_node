const { MongoClient, ObjectId } = require("mongodb");
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
    var db = client.db("thuru");
    const post = thuru_new_db.collection("Post");
    const postComments = thuru_new_db.collection("PostComments");
    const postLikes = thuru_new_db.collection("PostLikes");

    let result = await connection.awaitQuery(
      `SELECT fp.id as initial_id, fp.initial_post_id as ref_id, au.email as user_email, fp.isActive as fp_isActive, fp.dateTime as fp_date, t.localName as tree_localName,t.englishName as tree_englishName, t.scientificName as tree_scientificName, tg.name as group_name, tg.description as group_description, pt.metacode as postType, rn.metacode as repeat_meta, fp.code as mongo_code FROM forum_post fp, training_group tg, app_users au, post_type pt, forum_post refp, repeat_number rn, trees t WHERE fp.training_group=tg.id and fp.created_by_id=au.id and fp.tree_id=t.id and fp.post_type_id=pt.id and fp.repeat_number_id=rn.id and fp.initial_post_id=refp.id`
    );

    for (el of result) {
      var user = await thuru_new_db
        .collection("User")
        .findOne({ email: el.user_email });
      var tree = await thuru_new_db
        .collection("Tree")
        .findOne({
          localName: el.tree_localName,
          englishName: el.tree_englishName,
          scientificName: el.tree_scientificName,
        });
      var group = await thuru_new_db
        .collection("Group")
        .findOne({ groupName: el.group_name });
      var ref_post = await thuru_new_db
        .collection("Post")
        .findOne({ email: el.email });
      var post_type = await thuru_new_db
        .collection("PostType")
        .findOne({ metaCode: el.postType });
      var repeat_meta = await thuru_new_db
        .collection("RepeatMeta")
        .findOne({ metaCode: el.repeat_meta });
      var post_details = await db
        .collection("ForumPost")
        .findOne(ObjectId(el.mongo_code));

        if(user && tree && group &&  post_type && repeat_meta && post_details){
      const result = await post.insertOne({
        intial_post_id: el.initial_id,
        reference_post_id: el.ref_id,
        thisUUID: uniqid("post"),
        createdBy: {
          $ref: "User",
          $id: user._id,
        },
        createdByFullName: user.firstName + " " + user.lastName,
        createdByContact: user.email,
        createdByUUID: user.thisUUID,
        createdupdatedByBy: {
            $ref: "User",
            $id: user._id,
          },
          updatedByUUID: user.thisUUID,
        images: post_details.images,
        comments: [], // Array of username,firstname,lastname, userUUID,userImage,comment,commentUUID,commenttimestamp
        likes: [], // Array of username, firstname,lastname, userUUID,userImage
        isActive: Boolean(el.fp_isActive),
        status: true,
        created_date: new Date(el.fp_date),
        planted_date: new Date(el.fp_date),
        updated_date: new Date(el.fp_date),
        hot_date: new Date(el.fp_date),
        tree: {
          $ref: "Tree",
          $id: tree._id,
        },
        treeUUID: tree.thisUUID,
        treeName:
          tree.localName +
          " | " +
          tree.englishName +
          " | " +
          tree.scientificName,
        group: {
          $ref: "Group",
          $id: group._id,
        },
        groupUUID: group.thisUUID,
        groupName: group.groupName,
        isNotificationEnabled: true,
        isAlertGenerated: false,
        // post: {
        //   $ref: "Post",
        //   $id: ref_post._id,
        // },
        // postUUID: ref_post.thisUUID,
        postType: {
          $ref: "PostType",
          $id: post_type._id,
        },
        postTypeUUID: post_type.thisUUID,
        repeatMeta: {
          $ref: "RepeatMeta",
          $id: repeat_meta._id,
        },
        repeatMetaUUID: repeat_meta.thisUUID,
        location: {
          coordinates: [
            post_details.location? post_details.location.longitude:0,
            post_details.location?  post_details.location.latitude:0,
          ],
          type: "Point",
          latitude:  post_details.location? post_details.location.latitude:0,
          longitude:  post_details.location? post_details.location.longitude:0,
        },
        description: post_details.post_text,
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
