const db = require('../config/db'); // Your database connection

// Create the Users table if it doesn't exist

function createHotelTable() {
const hotel = `
CREATE TABLE IF NOT EXISTS hotel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  hotel_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  address VARCHAR(255) NOT NULL,
  nearest_city VARCHAR(255) NOT NULL
);
`;

// Execute the query
db.query(hotel, (err, result) => {
  if (err) {
    console.error("Error creating hotel table: ", err);
  } else {
    console.log("hotel table created or already exists.");
  }
});
}

module.exports = createHotelTable;
