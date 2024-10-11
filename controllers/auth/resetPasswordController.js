const db = require("../../config/db");
const bcrypt = require("bcrypt");

// reset hotel password
const resetPassword_hotel = (req, res) => {
  const { email, newPassword } = req.body;

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

      // Hash the new password before saving it
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: "Error hashing new password" });
        }

        // Update query to modify hotel password
        const updateQuery = `
          UPDATE hotel
          SET password = ?
          WHERE email = ?
        `;

        db.query(
          updateQuery,
          [hashedPassword, email], // Save the hashed new password
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error updating password", error: err });
            }

            // If the update is successful, return a success message
            return res
              .status(200)
              .json({ message: "Hotel password reset successfully" });
          }
        );
      });
    });
};

// reset laundry password
const resetPassword_laundry = (req, res) => {
    const { email, newPassword } = req.body;
  
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
  
        // Hash the new password before saving it
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ message: "Error hashing new password" });
          }
  
          // Update query to modify laundry password
          const updateQuery = `
            UPDATE laundry
            SET password = ?
            WHERE email = ?
          `;
  
          db.query(
            updateQuery,
            [hashedPassword, email], // Save the hashed new password
            (err, result) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error updating password", error: err });
              }
  
              // If the update is successful, return a success message
              return res
                .status(200)
                .json({ message: "laundry password updated successfully" });
            }
          );
        });
      });
  };

module.exports = {resetPassword_hotel, resetPassword_laundry};
