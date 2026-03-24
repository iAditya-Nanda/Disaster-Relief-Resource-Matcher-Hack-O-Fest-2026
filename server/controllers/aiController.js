const { triageNeedWithAI } = require('../services/aiService');

const getAIAnalysis = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Situation description is required' });
    }

    const analysis = await triageNeedWithAI(description);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAIAnalysis };
