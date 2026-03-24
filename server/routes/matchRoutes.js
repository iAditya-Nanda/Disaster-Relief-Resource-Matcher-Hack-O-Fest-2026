const express = require('express');
const router = express.Router();
const { findMatches, findMatchesForNeed } = require('../controllers/matchController');

// Matching is a public/coordinator tool to find aid quickly
router.get('/near', findMatches);

// Find resources matching a specific need
router.get('/need/:id', findMatchesForNeed);

module.exports = router;
