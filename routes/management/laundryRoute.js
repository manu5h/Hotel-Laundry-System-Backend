const express = require('express');
const router = express.Router();

const {
    getLaundryDetailsById,
    getOrdersByLaundryId,
    getDeliveryRidersByLaundryId,
    acceptOrderByLaundry,
    declineOrderByLaundry,
    getAllLaundryDetails
} = require('../../controllers/management/laundryController');

const authenticateToken = require('../../middleware/auth');

router.get('/all', getAllLaundryDetails)

router.get('/:laundry_id/details', getLaundryDetailsById)

router.get('/:laundry_id/orders', authenticateToken, getOrdersByLaundryId)

router.get('/:laundry_id/riders', authenticateToken, getDeliveryRidersByLaundryId)

router.post('/:laundry_id/order/:orderId/accept',authenticateToken, acceptOrderByLaundry)

router.put('/:laundry_id/order/:order_id/decline', authenticateToken, declineOrderByLaundry)


module.exports = router;