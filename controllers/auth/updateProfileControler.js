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
          return res
            .status(500)
            .json({ message: "Error updating hotel", error: err });
        }

        // If the update is successful, return a success message
        return res
          .status(200)
          .json({ message: "Hotel details updated successfully" });
      }
    );
  });
};

// Update laundry details
const updateLaundry = (req, res) => {
  const {
    email,
    laundry_name,
    phone_number,
    address,
    nearest_city
  } = req.body;

  // Query to check if the laundry exists based on the email
  const query = "SELECT * FROM laundry WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    // If no laundry is found with the given email
    if (results.length === 0) {
      return res.status(404).json({ message: "Laundry not found" });
    }

    // Update query to modify laundry details, including bank details
    const updateQuery = `
      UPDATE laundry
      SET laundry_name = ?, phone_number = ?, address = ?, nearest_city = ?
      WHERE email = ?
    `;

    db.query(
      updateQuery,
      [
        laundry_name,
        phone_number,
        address,
        nearest_city,
        email
      ],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error updating laundry", error: err });
        }

        // If the update is successful, return a success message
        return res
          .status(200)
          .json({ message: "Laundry details updated successfully" });
      }
    );
  });
};

// Update delivery rider details
const updateDeliveryRider = (req, res) => {
  const { email, name, phone_number, address, NIC, laundry_id } = req.body;

  // Query to check if the delivery rider exists based on the email
  const query = "SELECT * FROM deliveryriders WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    // If no delivery rider is found with the given email
    if (results.length === 0) {
      return res.status(404).json({ message: "Delivery rider not found" });
    }

    // Update query to modify delivery rider details
    const updateQuery = `
      UPDATE deliveryriders
      SET name = ?, phone_number = ?, address = ?, NIC = ?, laundry_id = ?
      WHERE email = ?
    `;

    db.query(
      updateQuery,
      [name, phone_number, address, NIC, laundry_id, email],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error updating delivery rider", error: err });
        }

        // If the update is successful, return a success message
        return res
          .status(200)
          .json({ message: "Delivery rider details updated successfully" });
      }
    );
  });
};

module.exports = { updateHotel, updateLaundry, updateDeliveryRider };
