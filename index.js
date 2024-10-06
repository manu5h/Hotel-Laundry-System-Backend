const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require('./routes/auth');

// Import the table creation scripts
const createLaundryTable = require("./models/laundry_model");
const createHotelTable = require("./models/hotel_model");
const createDeliveryRidersTable = require("./models/delivery_riders_model");
const createOrderTable = require("./models/order_model");
const createClothingItemTable = require("./models/clothing_item_model");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Execute table creation queries
createHotelTable();
createLaundryTable();
createDeliveryRidersTable();
createOrderTable();
createClothingItemTable();


// ROUTES

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Hotel Laundry System API");
});

// Authentication routes
app.use("/auth", authRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
