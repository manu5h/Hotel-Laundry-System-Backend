const express = require('express');
const router = express.Router();

const {
    getHotelDetailsById,
    getOrdersByHotelId,
    requestOrderToLaundry,
    acceptOrderByHotel,
    declineOrderByHotel
} = require('../../controllers/management/hotelController');

const authenticateToken = require('../../middleware/auth');

router.get('/:hotel_id/details', authenticateToken, getHotelDetailsById)

router.get('/:hotel_id/orders', authenticateToken, getOrdersByHotelId)

router.post('/:hotel_id/request-laundry',authenticateToken, requestOrderToLaundry)

router.post('/:hotel_id/order/:orderId/accept',authenticateToken, acceptOrderByHotel)

router.put('/:hotel_id/order/:order_id/decline', authenticateToken, declineOrderByHotel)


module.exports = router;