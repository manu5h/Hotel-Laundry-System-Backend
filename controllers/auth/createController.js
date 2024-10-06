const db = require("../../config/db");
const bcrypt = require("bcrypt");

// Register a hotel
const registerHotel = (req, res) => {
  const { email, password, hotel_name, phone_number, address, nearest_city } =
    req.body;

  // Hash the password before saving it
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // SQL query
    const query =
      "INSERT INTO hotel (email, password, hotel_name, phone_number, address, nearest_city) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      email,
      hashedPassword,
      hotel_name,
      phone_number,
      address,
      nearest_city,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error registering hotel", error: err.message });
      }
      return res.status(201).json({ message: "Hotel registered successfully" });
    });
  });
};

// Register a laundry
const registerLaundry = (req, res) => {
  const { email, password, laundry_name, phone_number, address, nearest_city } =
    req.body;

  // Hash the password before saving it
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // SQL query
    const query =
      "INSERT INTO laundry (email, password, laundry_name, phone_number, address, nearest_city) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      email,
      hashedPassword,
      laundry_name,
      phone_number,
      address,
      nearest_city,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error registering laundry", error: err.message });
      }
      return res
        .status(201)
        .json({ message: "Laundry registered successfully" });
    });
  });
};

// Register a delivery rider
const registerDeliveryRider = (req, res) => {
  const { email, name, phone_number, address, NIC, laundry_id } = req.body;

  // SQL query
  const query =
    "INSERT INTO deliveryriders (email, name, phone_number, address, NIC, laundry_id) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    email,
    name,
    phone_number,
    address,
    NIC,
    laundry_id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error registering laundry", error: err.message });
    }
    return res.status(201).json({ message: "Laundry registered successfully" });
  });
};

// Export both functions
module.exports = { registerHotel, registerLaundry, registerDeliveryRider };
