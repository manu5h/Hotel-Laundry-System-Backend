const express = require('express');
const router = express.Router();

const {
    getRiderDetailsById
} = require('../../controllers/management/riderController');

const authenticateToken = require('../../middleware/auth');

router.get('/:rider_id/details', authenticateToken, getRiderDetailsById)


module.exports = router;