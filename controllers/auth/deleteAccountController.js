const db = require("../../config/db");
const bcrypt = require("bcrypt");

// Delete hotel account
const deleteAccount_hotel = (req, res) => {
  const { email, Password } = req.body;

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

    const hotel = results[0]; // Get the first user result

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(Password, hotel.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Error comparing passwords" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid current password" });
      }

      // If password matches, proceed to delete the hotel account
      const deleteQuery = "DELETE FROM hotel WHERE email = ?";

      db.query(deleteQuery, [email], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error deleting account", error: err });
        }

        // If the deletion is successful, return a success message
        return res
          .status(200)
          .json({ message: "Hotel account deleted successfully" });
      });
    });
  });
};

// Delete laundry account
const deleteAccount_laundry = (req, res) => {
  const { email, Password } = req.body;

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

    const laundry = results[0]; // Get the first user result

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(Password, laundry.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Error comparing passwords" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid current password" });
      }

      // If password matches, proceed to delete the laundry account
      const deleteQuery = "DELETE FROM laundry WHERE email = ?";

      db.query(deleteQuery, [email], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error deleting account", error: err });
        }

        // If the deletion is successful, return a success message
        return res
          .status(200)
          .json({ message: "laundry account deleted successfully" });
      });
    });
  });
};

// Delete deliver rider account
const deleteAccount_delivery = (req, res) => {
  const { email } = req.body;

  // Query to check if the deliver rider exists based on the email
  const query = "SELECT * FROM deliveryriders WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    // If no deliver rider is found with the given email
    if (results.length === 0) {
      return res.status(404).json({ message: "deliver rider not found" });
    }

    const deleteQuery = "DELETE FROM deliveryriders WHERE email = ?";

    db.query(deleteQuery, [email], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error deleting account", error: err });
      }

      // If the deletion is successful, return a success message
      return res
        .status(200)
        .json({ message: "laundry account deleted successfully" });
    });
  });
};

module.exports = { deleteAccount_hotel, deleteAccount_laundry, deleteAccount_delivery };
