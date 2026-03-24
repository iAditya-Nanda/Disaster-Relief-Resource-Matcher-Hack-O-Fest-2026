const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { createNeed, getMyNeeds, updateNeedStatus } = require('../controllers/needsController');

// All needs routes require authentication
router.use(authenticateUser);

// Profile-specific help requests
router.get('/my', getMyNeeds);

// Create a new request (Role restriction added for security)
router.post('/add', authorizeRole(['Needy', 'NGO', 'Admin']), createNeed);

// Update status of need
router.patch('/:id/status', updateNeedStatus);

module.exports = router;
