const express = require('express');
const router = express.Router();

const {
    getHotelDetailsById
} = require('../../controllers/management/hotelController');

const authenticateToken = require('../../middleware/auth');

router.get('/:hotel_id/details', authenticateToken, getHotelDetailsById)


module.exports = router;