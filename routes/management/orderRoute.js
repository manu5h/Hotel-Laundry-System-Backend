const express = require('express');
const router = express.Router();

const {
    createOrder,
    pickupOrderFromHotel,
    handedToLaundryByRider,
    laundryCompleted,
    pickupOrderFromLaundry,
    completeOrder
} = require('../../controllers/management/orderController');

const authenticateToken = require('../../middleware/auth');

// Route for item Creation
router.post('/:hotel_id/create', authenticateToken, createOrder);

router.post('/hotelPickup',authenticateToken, pickupOrderFromHotel)

router.post('/laundryDrop',authenticateToken, handedToLaundryByRider)

router.post('/laundryCompleted',authenticateToken, laundryCompleted)

router.post('/laundryPickup',authenticateToken, pickupOrderFromLaundry)

router.post('/complete',authenticateToken, completeOrder)


module.exports = router;