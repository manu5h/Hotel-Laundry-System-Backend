const db = require("../../config/db");

// Check if email exists for hotel or laundry
const checkEmail = (req, res) => {
  const { email, role } = req.body;

  // Set the query based on the role (Hotel or Laundry)
  let query = "";
  if (role === "Hotel") {
    query = "SELECT * FROM hotel WHERE email = ?";
  } else if (role === "Laundry") {
    query = "SELECT * FROM laundry WHERE email = ?";
  }

  // Execute the query
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    // Check if any result is found
    if (results.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    // If email exists, return success
    return res.status(200).json({ message: "Email found", role });
  });
};

module.exports = { checkEmail };
