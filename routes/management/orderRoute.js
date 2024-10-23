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

router.post('/:orderId/hotelPickup',authenticateToken, pickupOrderFromHotel)

router.post('/:orderId/laundryDrop',authenticateToken, handedToLaundryByRider)

router.post('/:orderId/laundryCompleted',authenticateToken, laundryCompleted)

router.post('/:orderId/laundryPickup',authenticateToken, pickupOrderFromLaundry)

router.post('/:orderId/complete',authenticateToken, completeOrder)


module.exports = router;