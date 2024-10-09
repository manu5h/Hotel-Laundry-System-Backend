const express = require('express');
const router = express.Router();

const {createOrder,getOrdersByHotelId ,requestOrderToLaundry} = require('../../controllers/management/orderController');
const authenticateToken = require('../../middleware/auth');

// Route for item Creation
router.post('/create', createOrder);

//Route for get orders by hotel id
router.get('/hotel/:hotel_id', authenticateToken, getOrdersByHotelId);

router.post('/hotel/:hotel_id/request-laundry',authenticateToken, requestOrderToLaundry)

module.exports = router;