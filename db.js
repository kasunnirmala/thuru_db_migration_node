const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongodb + srv://root:16826@cluster0-7kwmc.gcp.mongodb.net/campsite?retryWrites=true&w=majority
// Connecting to the database
mongoose.connect("mongodb://localhost:27017/thuru", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});