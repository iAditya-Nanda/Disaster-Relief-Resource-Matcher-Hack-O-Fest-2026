const express = require('express');
const router = express.Router();
const { getAIAnalysis, matchChat, medicalChat } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/auth');

// Protected route to analyze crises with AI
router.post('/triage', authenticateUser, getAIAnalysis);

// Match & Chat endpoint
router.post('/chat', authenticateUser, matchChat);

// Medical Triage & Chat endpoint
router.post('/medical_chat', authenticateUser, medicalChat);

module.exports = router;
