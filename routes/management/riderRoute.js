const express = require('express');
const router = express.Router();

const {
    getRiderDetailsById,
    setPickupDeliveryRider,
    setDropDeliveryRider
} = require('../../controllers/management/riderController');

const authenticateToken = require('../../middleware/auth');

router.get('/:rider_id/details', authenticateToken, getRiderDetailsById)

router.post('/pickupRider',authenticateToken, setPickupDeliveryRider)

router.post('/laundry/dropRider',authenticateToken, setDropDeliveryRider)

module.exports = router;