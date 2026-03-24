const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { generateCollectionToken, verifyCollection } = require('../controllers/logisticsController');
const { findBloodDonors } = require('../controllers/bloodController');

// Logistics Handover (Phase 5.1)
router.post('/qr/generate', authenticateUser, generateCollectionToken);
router.post('/qr/verify', authenticateUser, verifyCollection);

// Blood Emergency (Phase 5.2)
router.get('/blood/find', findBloodDonors);

module.exports = router;
