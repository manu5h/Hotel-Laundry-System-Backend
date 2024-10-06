const express = require('express');
const router = express.Router();

const {createClothingItem } = require('../../controllers/management/clothingItemController');

// Route for item Creation
router.post('/create', createClothingItem);

module.exports = router;