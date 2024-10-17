const express = require('express');
const router = express.Router();

const {
    getHotelDetailsById,
    declineOrderByHotel
} = require('../../controllers/management/hotelController');

const authenticateToken = require('../../middleware/auth');

router.get('/:hotel_id/details', authenticateToken, getHotelDetailsById)

router.put('/:hotel_id/orders/:order_id/decline', authenticateToken, declineOrderByHotel)


module.exports = router;