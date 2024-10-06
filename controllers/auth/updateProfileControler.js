const db = require("../../config/db");

// update hotel details
const updateHotel = (req, res) => {
  const { email, hotel_name, phone_number, address, nearest_city } = req.body;

  // Query to check if the hotel exists based on the email
  const query = "SELECT * FROM hotel WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    // If no hotel is found with the given email
    if (results.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Update query to modify hotel details
    const updateQuery = `
      UPDATE hotel
      SET hotel_name = ?, phone_number = ?, address = ?, nearest_city = ?
      WHERE email = ?
    `;

    db.query(
      updateQuery,
      [hotel_name, phone_number, address, nearest_city, email],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error updating hotel", error: err });
        }

        // If the update is successful, return a success message
        return res.status(200).json({ message: "Hotel details updated successfully" });
      }
    );
  });
};

// update laundry details
const updateLaundry = (req, res) => {
    const { email, laundry_name, phone_number, address, nearest_city } = req.body;
  
    // Query to check if the laundry exists based on the email
    const query = "SELECT * FROM laundry WHERE email = ?";
  
    db.query(query, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      // If no laundry is found with the given email
      if (results.length === 0) {
        return res.status(404).json({ message: "laundry not found" });
      }
  
      // Update query to modify laundry details
      const updateQuery = `
        UPDATE laundry
        SET laundry_name = ?, phone_number = ?, address = ?, nearest_city = ?
        WHERE email = ?
      `;
  
      db.query(
        updateQuery,
        [laundry_name, phone_number, address, nearest_city, email],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: "Error updating laundry", error: err });
          }
  
          // If the update is successful, return a success message
          return res.status(200).json({ message: "laundry details updated successfully" });
        }
      );
    });
  };

module.exports = {updateHotel, updateLaundry};
