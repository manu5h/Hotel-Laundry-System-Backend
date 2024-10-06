const db = require('../config/db'); // Your database connection

// Create the clothingitems table if it doesn't exist
function createClothingItemTable() {
  const clothingitems = `
  CREATE TABLE IF NOT EXISTS clothingItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    cleaningType VARCHAR(255) NOT NULL,
    pressigng_ironing BOOL NOT NULL,
    stain_removal BOOL NOT NULL,
    folding BOOL NOT NULL,
    special_instructions VARCHAR(255),
    order_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
  `;

  // Execute the query
  db.query(clothingitems, (err, result) => {
    if (err) {
      console.error("Error creating deliveryRiders table: ", err);
    } 
  });
}

module.exports = createClothingItemTable;