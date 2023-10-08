require("dotenv").config({ path: "./.env" });

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    return client;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

connectDB().then(client => {
  require("./routes")(app, client); // Pass the connected client to your routes

  // Set the view engine to Pug
  app.set('view engine', 'pug');
  app.set('views', './views');

  const PORT = process.env.PORT || 8080;
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.log(err);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit();
});