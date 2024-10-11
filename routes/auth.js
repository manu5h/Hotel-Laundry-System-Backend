// routes/auth.js
const express = require('express');
const router = express.Router();

const { registerHotel, registerLaundry, registerDeliveryRider } = require('../controllers/auth/createController');
const { loginHotel, loginLaundry, loginDeliveryRiders } = require('../controllers/auth/loginController');
const { updateHotel, updateLaundry, updateDeliveryRider } = require('../controllers/auth/updateProfileControler');
const { changePassword_hotel, changePassword_laundry } = require('../controllers/auth/changePasswordController');
const {resetPassword_hotel, resetPassword_laundry} = require('../controllers/auth/resetPasswordController');
const { deleteAccount_hotel, deleteAccount_laundry, deleteAccount_delivery } = require('../controllers/auth/deleteAccountController');
const { sendOtp, verifyOtp } = require('../controllers/auth/otpController');

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

// Route for update hotel information
router.put('/update/laundry', updateLaundry);

// Route for update delivery rider information
router.put('/update/deliveryRider', updateDeliveryRider);

// Route for update hotel password
router.put('/changePassword/hotel', changePassword_hotel); 

// Route for update Laundry password
router.put('/changePassword/laundry', changePassword_laundry); 

// Route for reset hotel password
router.put('/resetPassword/hotel', resetPassword_hotel); 

// Route for reset laundry password
router.put('/resetPassword/laundry', resetPassword_laundry); 

// Route for delete hotel
router.delete('/delete/hotel', deleteAccount_hotel);

// Route for delete laundry
router.delete('/delete/laundry', deleteAccount_laundry);

// Route for delete delivery
router.delete('/delete/delivery', deleteAccount_delivery);

//send otp
router.post('/send-otp', sendOtp);

//veridy otp
router.post('/verify-otp', verifyOtp);

module.exports = router;
