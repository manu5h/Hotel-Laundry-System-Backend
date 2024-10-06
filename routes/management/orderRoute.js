const express = require('express');
const router = express.Router();

const {createOrder } = require('../../controllers/management/orderController');

// Route for item Creation
router.post('/create', createOrder);

module.exports = router;