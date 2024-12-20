require('dotenv').config();
const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require('./routes/auth');
const clothinItemRoutes = require('./routes/management/clothingItemRoute');
const orderRoutes = require('./routes/management/orderRoute');
const hotelRoutes = require('./routes/management/hotelRoute');
const laundryRoutes = require('./routes/management/laundryRoute');
const riderRoutes = require('./routes/management/riderRoute');
const paymentRoutes = require('./routes/paymentRoutes'); // New payment route

// Import the table creation scripts
const createLaundryTable = require("./models/laundry_model");
const createHotelTable = require("./models/hotel_model");
const createDeliveryRidersTable = require("./models/delivery_riders_model");
const createOrderTable = require("./models/order_model");
const createClothingItemTable = require("./models/clothing_item_model");
const createOTPTable = require("./models/OTP_model");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Execute table creation queries
createHotelTable();
createLaundryTable();
createDeliveryRidersTable();
createOrderTable();
createClothingItemTable();
createOTPTable();

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Hotel Laundry System API");
});

// Authentication and management routes
app.use("/auth", authRoutes);
app.use("/item", clothinItemRoutes);
app.use("/order", orderRoutes);
app.use("/hotel", hotelRoutes);
app.use("/laundry", laundryRoutes);
app.use("/rider", riderRoutes);

// Stripe payment routes
app.use("/payment", paymentRoutes); // Add Stripe payment routes

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
