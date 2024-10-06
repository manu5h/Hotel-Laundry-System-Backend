const db = require('../config/db'); // Your database connection

// Create the Orders table if it doesn't exist
function createOrderTable() {
  const orderTable = `
  CREATE TABLE IF NOT EXISTS orders
  (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderStatus INT NOT NULL,
    pickupFromHotelDateTime DATETIME,
    handedToLaundryDateTime DATETIME,
    laundryCompletedDateTime DATETIME,
    pickupFromLaundryDateTime DATETIME,
    orderCompletedDateTime DATETIME,
    special_notes VARCHAR(255)
  );
  `;

  // Execute the query
  db.query(orderTable, (err, result) => {
    if (err) {
      console.error("Error creating orders table: ", err);
    }
  });
}

module.exports = createOrderTable;