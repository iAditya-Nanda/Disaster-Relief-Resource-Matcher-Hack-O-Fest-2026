const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { createResource, getNearbyResources, updateResourceStatus } = require('../controllers/resourceController');

// Public route to find aid
router.get('/near', getNearbyResources);

// Protected NGO-only route to add aid
router.post('/add', authenticateUser, authorizeRole(['NGO', 'Admin']), createResource);

// Update status of aid (NGO/Admin only)
router.patch('/:id/status', authenticateUser, updateResourceStatus);

module.exports = router;
