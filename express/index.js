const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require("axios");
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const route = express.Router();
const port = process.env.PORT || 5001;app.use('/v1', route);
app.listen(port, () => {    
  console.log(`Server listening on port ${port}`);
});

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'some-password',
  database: 'devx',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

route.post('/add-location', (req, res) => {
  const { name, category, user, lng, lat } = req.body;

  const query = 'INSERT INTO locations (location_name, location_category, user_name, location_longitude, location_lattitude) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [name, category, user, lng, lat], (err, result) => {
    if (err) {
      return res.status(500).send('Error adding user to the database.');
    }
    res.status(200).send('User added successfully.');
  });
});

route.post('/get-location', (req, res) => {
  const { category } = req.body;

  const query = 'SELECT * FROM locations WHERE location_category = ?';
  
  db.query(query, [category], (err, results) => {
    if (err) {
      return res.status(500).send('Error getting location.');
    }

    if (results.length > 0) {
      res.status(200).json(results); // Ensure the response is in JSON format
    } else {
      res.status(401).send('Location not found.');
    }
  });
});

route.post('/get-location-by-pos', (req, res) => {
  const { lng, lat } = req.body;

  const query = 'SELECT * FROM locations WHERE location_longitude = ? AND location_lattitude = ?';
  
  db.query(query, [lng, lat], (err, results) => {
    if (err) {
      return res.status(500).send('Error getting location.');
    }

    if (results.length > 0) {
      res.status(200).json(results); // Ensure the response is in JSON format
    } else {
      res.status(401).send('Location not found.');
    }
  });
});

