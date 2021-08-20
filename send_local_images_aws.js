var AWS = require("aws-sdk");
var fs = require("fs");
var accessKeyId = "AKIARTHDQX4F2N7L2LAW";
var secretAccessKey = "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";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

var s3 = new AWS.S3();

connect();
async function connect() {
  try {
    var dir = "C:\\Users\\Lenovo\\Desktop\\upload\\all";
    var fileNames = fs.readdirSync(dir);
    var ind = 0;
    for (file of fileNames) {
      ind++;
      if (ind < 3) {
        const fileContent = fs.readFileSync(`${dir}\\${file}`);

        var params = {
          Bucket: "thuru",
          Key: "images/" + file,
          Body: fileContent,
        };

        console.log(ind);
        let data = await s3.putObject(params).promise()
     console.log(data);
      }
    }
  } catch (e) {
    console.log(e);
  }
}
