const db = require('../config/db'); // Your database connection

// Create the deliveryRiders table if it doesn't exist
function createDeliveryRidersTable() {
  const deliveryRiders = `
  CREATE TABLE IF NOT EXISTS deliveryRiders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    NIC VARCHAR(255) NOT NULL,
    laundry_id INT,
    FOREIGN KEY (laundry_id) REFERENCES laundry(id) ON DELETE CASCADE
  );
  `;

  // Execute the query
  db.query(deliveryRiders, (err, result) => {
    if (err) {
      console.error("Error creating deliveryRiders table: ", err);
    } 
  });
}

module.exports = createDeliveryRidersTable;
