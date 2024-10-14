const express = require('express');
const router = express.Router();

const {
    getLaundryDetailsById
} = require('../../controllers/management/laundryController');

const authenticateToken = require('../../middleware/auth');

router.get('/:laundry_id/details', authenticateToken, getLaundryDetailsById)


module.exports = router;