const express = require('express');
const router = express.Router();

const {createClothingItem,getClothingItemsByHotelId } = require('../../controllers/management/clothingItemController');
const authenticateToken = require('../../middleware/auth');

// Route for item Creation
router.post('/:hotel_id/create', authenticateToken,createClothingItem);

//Route for get items by hotel id
router.get('/hotel/:hotel_id', authenticateToken, getClothingItemsByHotelId);

module.exports = router;