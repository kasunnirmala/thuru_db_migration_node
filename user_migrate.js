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
    const user = thuru_new_db.collection("User");
    // const result = await user.insertOne({username:"Username"});
    // connection.query('SELECT * from app_users', function (error, results, fields) {
    //     if (error) throw error;
    //     results.forEach(async el => {

    //         const result = await user.insertOne({username:el.username});
    //     });
    //   });

    let result = await connection.awaitQuery(
      `SELECT * FROM app_users au,role r where au.role_id=r.id`
    );
    result.forEach(async (el) => {
      console.log(i++)
      var map = {
        ROLE_THURU_ADMIN: "ROLE_SUPER_ADMIN",
        THURU_ORGANIZATION_USER: "ROLE_GROUP_ADMIN",
        ROLE_TRAINEE: "ROLE_USER",
      };
      var role = await thuru_new_db
        .collection("Role")
        .findOne({ metaCode: map[el.metacode] });


      const result = await user.insertOne({
        thisUUID: uniqid("user"),
        username: el.username,
        password: el.password,
        profileImage: el.image_name,
        firstName: el.first_name,
        lastName: el.last_name,
        email: el.email,
        phoneNumber: el.phone_number,
        facebook: el.fb_id ? true : false,
        google: el.google_id ? true : false,
        apple: false,
        pushEnabled: Boolean(el.is_push_notification_enabled),
        smsEnabled: Boolean(el.is_sms_notification_enabled),
        active: Boolean(el.is_avtice),
        locked: Boolean(el.is_locked),
        verificationCode: el.password_reset_code,
        salt: null,
        role: {
          $ref: "Role",
          $id: role._id,
        },
        roleUUID: role.thisUUID,
      });
    });

    //     const cursor=await  db.collection('ForumPost').find({post_text:"Mango"});

    //    var ind=0;
    //     await cursor.forEach(async (res)=>{
    //         console.log(ind++);
    //      console.log(res);

    //     });
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
    // connection.end();
  }
}
