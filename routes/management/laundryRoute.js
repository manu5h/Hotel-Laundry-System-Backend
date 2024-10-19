const express = require('express');
const router = express.Router();

const {
    getLaundryDetailsById,
    getOrdersByLaundryId,
    declineOrderByLaundry
} = require('../../controllers/management/laundryController');

const authenticateToken = require('../../middleware/auth');

router.get('/:laundry_id/details', authenticateToken, getLaundryDetailsById)

router.get('/:laundry_id/orders', authenticateToken, getOrdersByLaundryId)

router.put('/:laundry_id/orders/:order_id/decline', authenticateToken, declineOrderByLaundry)


module.exports = router;