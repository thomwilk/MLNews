require("dotenv").config({ path: "./.env" });

const express = require('express');
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.static('public'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = new MongoClient(process.env.MONGODB_URI);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

require("./routes")(app);

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', './views');

connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
    // Start the server
    app.listen(PORT,() => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch(err => {
    console.log(err);
    process.exit(1);
})

process.on("SIGINT", () => {
  mongoose.connection.close().then(() => {
    console.log("MongoDB connection closed");
    process.exit();
  });
});