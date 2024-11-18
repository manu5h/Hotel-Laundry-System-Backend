const db = require('../config/db'); // Your database connection

// Create the Orders table if it doesn't exist
function createOrderTable() {
  const orderTable = `
    CREATE TABLE IF NOT EXISTS orders
    (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderStatus INT NOT NULL,
      created_time DATETIME NOT NULL,
      requestedToLaundryDateTime DATETIME,
      confirmedByHotelDateTime DATETIME,
      pickupFromHotelDateTime DATETIME,
      handedToLaundryDateTime DATETIME,
      laundryCompletedDateTime DATETIME,
      pickupFromLaundryDateTime DATETIME,
      orderCompletedDateTime DATETIME,
      weight DOUBLE,
      special_notes VARCHAR(255),
      price DOUBLE,
      review DOUBLE,
      feedback VARCHAR(255),
      hotel_id INT NOT NULL,
      FOREIGN KEY (hotel_id) REFERENCES hotel(id) ON DELETE CASCADE,
      laundry_id INT,
      FOREIGN KEY (laundry_id) REFERENCES laundry(id) ON DELETE CASCADE,
      pickup_delivery_rider_id INT,
      FOREIGN KEY (pickup_delivery_rider_id) REFERENCES deliveryRiders(id) ON DELETE CASCADE,
      drop_delivery_rider_id INT,
      FOREIGN KEY (drop_delivery_rider_id) REFERENCES deliveryRiders(id) ON DELETE CASCADE
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
