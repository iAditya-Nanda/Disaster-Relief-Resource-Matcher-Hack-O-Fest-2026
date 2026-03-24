const express = require('express');
const router = express.Router();
const { getAIAnalysis } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/auth');

// Protected route to analyze crises with AI
router.post('/triage', authenticateUser, getAIAnalysis);

module.exports = router;
