require("dotenv").config({ path: "./.env" });

const { getArticleInfo } = require("./scraper");
const { extractor } = require("./extractor");

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


module.exports = (app, db) => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/all-urls', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db("mlnews").collection("urls");
        
        const urls = await collection.find({}).toArray();
        
        res.json(urls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
});


app.post('/add-url', async (req, res) => {
  const url = req.body.url;
  if (!url) {
      return res.status(400).json({ error: 'URL is required' });
  }

  let domain;
  try {
      domain = new URL(urlValue).hostname;
  } catch (err) {
      return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!newsSources.domains.includes(domain)) {
      return res.status(400).json({ error: 'Domain not allowed' });
  }

  try {
      await client.connect();
      const collection = client.db("mlnews").collection("urls");

      // Check if the URL already exists
      const existingUrl = await collection.findOne({ url: url });
      if (existingUrl) {
          return res.status(409).json({ error: 'URL already exists' });
      }

      // Fetch article info
      const article = await getArticleInfo(url);
      const { title, description } = article;
      const image_url = article.image_url;

      // Insert the new URL into the MongoDB collection
      const result = await collection.insertOne({ url, title, description, image: image_url });
      
      res.render('index', { shortUrl: `http://localhost:3000/${result.insertedId}` });
  } catch (err) {
      res.status(500).json({ error: err.message });
  } finally {
      await client.close();
  }
});
 
app.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
      await client.connect();
      const collection = client.db("mlnews").collection("urls");

      // Fetch the URL by its ObjectID
      const urlDocument = await collection.findOne({ _id: ObjectId(id) });
      if (urlDocument) {
          res.status(200).render('redirect', { 
              title: urlDocument.title, 
              description: urlDocument.description, 
              image: urlDocument.image, 
              url: urlDocument.url 
          });
      } else {
          res.status(404).json({ error: 'URL not found' });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  } finally {
      await client.close();
  }
});
};
