// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "20010922Insta",
    database: "hotel_laundry_system_db"
  });

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});



module.exports = db;
