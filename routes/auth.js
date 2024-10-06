// routes/auth.js
const express = require('express');
const router = express.Router();

const { registerHotel, registerLaundry, registerDeliveryRider } = require('../controllers/auth/registerController');
const { loginHotel, loginLaundry, loginDeliveryRiders } = require('../controllers/auth/loginController');
const { updateHotel, updateLaundry } = require('../controllers/auth/updateProfileControler');
const authenticateToken = require('../middleware/auth');


// Route for hotel registration
router.post('/register/hotel', registerHotel); 

// Route for laundry registration
router.post('/register/laundry', registerLaundry);

// Route for delivery rider registration
router.post('/register/deliveryRider', registerDeliveryRider);

// Route for hotel login
router.post('/login/hotel', loginHotel); 

// Route for laundry login
router.post('/login/laundry', loginLaundry); 

// Route for Delivery Riders login
router.post('/login/deliveryRider', loginDeliveryRiders); 

// Route for update hotel information
router.put('/update/hotel', updateHotel); 

// Route for update Laundry information
router.put('/update/laundry', updateLaundry); 


module.exports = router;
