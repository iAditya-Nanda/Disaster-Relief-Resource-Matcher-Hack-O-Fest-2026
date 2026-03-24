const axios = require('axios');

const OLLAMA_CLOUD_HOST = process.env.OLLAMA_CLOUD_HOST || 'https://api.ollama.com';
const OLLAMA_CLOUD_MODEL = process.env.OLLAMA_CLOUD_MODEL || 'gpt-oss:120b';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
if (OLLAMA_API_KEY) {
    console.log(`[AI-DEBUG] API Key detected: ${OLLAMA_API_KEY.substring(0, 4)}...${OLLAMA_API_KEY.substring(OLLAMA_API_KEY.length - 4)}`);
} else {
    console.warn('[AI-DEBUG] No API Key found in environment');
}

// --- REPLICATING PYTHON BRAIN LOGIC ---

const SYSTEM_PROMPT = `
You are the Himachal-Sahayata AI Assistant, a powerful relief coordinator built by Aditya. 
Interpret the user's disaster-related command and respond.
Respond ONLY with a valid JSON object.

Rules:
1. Speech must be concise but helpful.
2. Language Policy: If the user speaks in English, respond in English. If the user speaks in Hindi or Hinglish, respond in Hinglish (Hindi words using English alphabets). NEVER use Devanagari script (Hindi characters).
3. Personality: Protective, loyal, and efficient under pressure.

Output Schema:
{
  "category": "Food/Medicine/Shelter/Blood/Rescue",
  "urgency": 1-10,
  "speech": "concise guidance",
  "reason": "short explanation"
}
`;

// Triage Logic (Direct port of Python brain.process)
const triageNeedWithAI = async (description) => {
  try {
    const data = {
      model: OLLAMA_CLOUD_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: description }
      ],
      stream: false
    };

    // Correcting endpoint for Ollama Cloud (Phase 4.1 Fix)
    const response = await axios.post(`${OLLAMA_CLOUD_HOST}/api/chat`, data, {
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Ollama /api/chat response format differs from OpenAI /v1/
    const rawContent = response.data.message.content;
    return JSON.parse(rawContent);
  } catch (error) {
    console.error('Ollama Cloud Triage Error:', error.response ? error.response.data : error.message);
    return { category: 'Other', urgency: 5, speech: "Server error during triage.", reason: "Backend connection issue." };
  }
};

// Semantic Matcher (Beyond Keywords)
const checkSemanticRelevance = async (needText, resourceText) => {
  try {
    const prompt = `Task: Is this Resource Helpful?
      Need: "${needText}"
      Resource: "${resourceText}"
      Reply ONLY: YES or NO.`;

    const data = {
      model: OLLAMA_CLOUD_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    };

    const response = await axios.post(`${OLLAMA_CLOUD_HOST}/api/chat`, data, {
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`
      }
    });

    const choice = response.data.message.content.trim().toUpperCase();
    return choice === 'YES' || choice.includes('YES');
  } catch (error) {
    console.error('Ollama Semantic Error:', error.response ? error.response.data : error.message);
    return true; // Safety fallback
  }
};

module.exports = { triageNeedWithAI, checkSemanticRelevance };
