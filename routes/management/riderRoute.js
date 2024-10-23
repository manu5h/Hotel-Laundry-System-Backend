const express = require('express');
const router = express.Router();

const {
    getRiderDetailsById,
    setPickupDeliveryRider,
    setDropDeliveryRider,
    getOrdersByRiderId
} = require('../../controllers/management/riderController');

const authenticateToken = require('../../middleware/auth');

router.get('/:rider_id/details', authenticateToken, getRiderDetailsById)

router.get('/:rider_id/orders' , authenticateToken, getOrdersByRiderId)

router.post('/pickupRider',authenticateToken, setPickupDeliveryRider)

router.post('/dropRider',authenticateToken, setDropDeliveryRider)

module.exports = router;