const express = require('express');
const router = express.Router();

const {
    createOrder,
    setPickupDeliveryRider,
    pickupOrderFromHotel,
    handedToLaundryByRider,
    laundryCompleted,
    setDropDeliveryRider,
    pickupOrderFromLaundry,
    completeOrder
} = require('../../controllers/management/orderController');

const authenticateToken = require('../../middleware/auth');

// Route for item Creation
router.post('/:hotel_id/create', authenticateToken, createOrder);

router.post('/laundry/pickupRider',authenticateToken, setPickupDeliveryRider)

router.post('/rider/hotel/pickup',authenticateToken, pickupOrderFromHotel)

router.post('/rider/laundry/drop',authenticateToken, handedToLaundryByRider)

router.post('/laundry/completed',authenticateToken, laundryCompleted)

router.post('/laundry/dropRider',authenticateToken, setDropDeliveryRider)

router.post('/rider/laundry/pickup',authenticateToken, pickupOrderFromLaundry)

router.post('/rider/hotel/complete',authenticateToken, completeOrder)


module.exports = router;