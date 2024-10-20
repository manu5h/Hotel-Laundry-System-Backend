const db = require('../config/db'); // Your database connection

// Create the Laundry table with bank details if it doesn't exist
function createLaundryTable() {
  const laundry = `
  CREATE TABLE IF NOT EXISTS laundry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    laundry_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    nearest_city VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_account_holder_name VARCHAR(255) NOT NULL,
    bank_branch VARCHAR(255) NOT NULL,
    rating DOUBLE
  );
  `;

  // Execute the query
  db.query(laundry, (err, result) => {
    if (err) {
      console.error("Error creating laundry table: ", err);
    }
  });
}

module.exports = createLaundryTable;
