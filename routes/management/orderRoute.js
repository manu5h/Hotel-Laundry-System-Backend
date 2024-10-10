const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrdersByHotelId ,
    requestOrderToLaundry,
    acceptOrderByLaundry, 
    acceptOrderByHotel,
    setDeliveryRider,
    pickupOrderByRider,
    handedToLaundryByRider,
    laundryCompleted
} = require('../../controllers/management/orderController');
const authenticateToken = require('../../middleware/auth');

// Route for item Creation
router.post('/create', createOrder);

//Route for get orders by hotel id
router.get('/hotel/:hotel_id', authenticateToken, getOrdersByHotelId)

router.post('/hotel/request-laundry',authenticateToken, requestOrderToLaundry)

router.post('/laundry/accept',authenticateToken, acceptOrderByLaundry)

router.post('/hotel/accept',authenticateToken, acceptOrderByHotel)

router.post('/laundry/pickupRider',authenticateToken, setDeliveryRider)

router.post('/rider/hotel/pickup',authenticateToken, pickupOrderByRider)

router.post('/rider/laundry/drop',authenticateToken, handedToLaundryByRider)

router.post('/laundry/completed',authenticateToken, laundryCompleted)
module.exports = router;