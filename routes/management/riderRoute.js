const express = require('express');
const router = express.Router();

const {
    getRiderDetailsById,
    getDeliveryRidersByLaundryId
} = require('../../controllers/management/riderController');

const authenticateToken = require('../../middleware/auth');

router.get('/:rider_id/details', authenticateToken, getRiderDetailsById)

router.get('/:laundry_id/riders', authenticateToken, getDeliveryRidersByLaundryId)


module.exports = router;