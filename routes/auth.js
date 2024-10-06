// routes/auth.js
const express = require('express');
const router = express.Router();
const { registerHotel, registerLaundry } = require('../controllers/auth/registerController');
const { loginHotel, loginLaundry } = require('../controllers/auth/loginController');
const authenticateToken = require('../middleware/auth');

// Route for hotel registration
router.post('/register/hotel', registerHotel); 

// Route for laundry registration
router.post('/register/laundry', registerLaundry);

// Route for hotel login
router.post('/login/hotel', loginHotel); 

// Route for laundry login
router.post('/login/laundry', loginLaundry); 

module.exports = router;
