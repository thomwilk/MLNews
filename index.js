const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const { getArticleInfo } = require("./scraper");
const { extractor } = require("./extractor");

const app = express();
const port = 3000;
const path = require('path');

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite database
const db = new sqlite3.Database('./urls.db');

// Create a table to store URLs
db.run('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT UNIQUE, title TEXT)');

// Middleware to parse POST request body
app.use(express.json());

app.set('view engine', 'pug');

// Route to render the Pug file
app.get('/', (req, res) => {
  res.render('index');
});

// Route to fetch all URLs from the database
app.get('/all-urls', (req, res) => {
  db.all('SELECT * FROM urls', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/add-url', (req, res) => {
  const url = req.body.url;

  // Check if the URL is valid
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Check if the URL is already in the database
  db.get('SELECT id FROM urls WHERE url = ?', url, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.status(409).json({ error: 'URL already exists' });
    }
  });

  // Scrape the HTML from the URL
  getArticleInfo(url)
    .then(html => {
      // Extract the title, description, and image from the HTML
      const { title, description, image } = extractor(html);

      // Insert the URL, title, description, and image into the database
      console.log(url, title, description, image);
      db.run('INSERT INTO urls(url, title, description, image) VALUES(?, ?, ?, ?)', [url, title, description, image], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.render('index', { shortUrl: `http://localhost:3000/${this.lastID}` })
      });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
});

// Route to redirect to the URL by ID
app.get('/:id', (req, res) => {
  const id = req.params.id;
  // Query the database to find the URL by ID
  db.get('SELECT url FROM urls WHERE id = ?', id, (err, row) => {
    if (err) {
      // If an error occurs, send a 500 Internal Server Error response
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      // If the URL is found, redirect to that URL
      res.redirect(row.url);
    } else {
      // If the URL is not found, send a 404 Not Found response
      res.status(404).json({ error: 'URL not found' });
    }
  });
});


// Other routes remain the same...

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
