const db = require("../../config/db");
const bcrypt = require("bcrypt");

// Change hotel password
const changePassword_hotel = (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

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
    bcrypt.compare(currentPassword, hotel.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Error comparing passwords" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid current password" });
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
              .json({ message: "Hotel password updated successfully" });
          }
        );
      });
    });
  });
};

// Change laundry password
const changePassword_laundry = (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
  
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
      bcrypt.compare(currentPassword, laundry.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: "Error comparing passwords" });
        }
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid current password" });
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
    });
  };

module.exports = {changePassword_hotel, changePassword_laundry};
