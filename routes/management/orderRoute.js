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

router.post('/rider/hotel/pickup',authenticateToken, pickupOrderFromHotel)

router.post('/rider/laundry/drop',authenticateToken, handedToLaundryByRider)

router.post('/laundry/completed',authenticateToken, laundryCompleted)

router.post('/rider/laundry/pickup',authenticateToken, pickupOrderFromLaundry)

router.post('/rider/hotel/complete',authenticateToken, completeOrder)


module.exports = router;