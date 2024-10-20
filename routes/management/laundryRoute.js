const express = require('express');
const router = express.Router();

const {
    getLaundryDetailsById,
    getOrdersByLaundryId,
    acceptOrderByLaundry,
    declineOrderByLaundry
} = require('../../controllers/management/laundryController');

const authenticateToken = require('../../middleware/auth');

router.get('/:laundry_id/details', authenticateToken, getLaundryDetailsById)

router.get('/:laundry_id/orders', authenticateToken, getOrdersByLaundryId)

router.post('/:laundry_id/order/:orderId/accept',authenticateToken, acceptOrderByLaundry)

router.put('/:laundry_id/order/:order_id/decline', authenticateToken, declineOrderByLaundry)


module.exports = router;