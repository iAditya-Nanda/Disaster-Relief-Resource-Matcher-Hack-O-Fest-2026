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

// Matches a user's need against available NGO resources
const generateIntelligentMatchResponse = async (userMessage, allResources, chatHistory = []) => {
  try {
    const resourceContext = allResources.map(r => 
      `- ${r.title} (Category: ${r.category}, Qty: ${r.quantity} ${r.unit || ''}, Status: ${r.status}) provided by ${r.profiles?.full_name || 'NGO'}`
    ).join('\n');

    const historyContext = chatHistory.map(m => `${m.sender_id === 'ai' ? 'AI' : 'User'}: ${m.text}`).join('\n');

    const prompt = `
      You are the Himachal-Sahayata AI Relief Coordinator.
      
      CONTEXT (NGO INVENTORY):
      ${resourceContext}

      CHAT HISTORY:
      ${historyContext}

      USER MESSAGE:
      "${userMessage}"

      TASK:
      1. Analyze if the user's need can be fulfilled by any of the available resources.
      2. If a match is found, clearly state which NGO/resource can help.
      3. If no exact match is found, provide guidance or ask for more details.
      4. Maintain the personality: Protective, loyal, and efficient.
      5. Output ONLY a valid JSON object.

      JSON SCHEMA:
      {
        "speech": "concise guidance including match details if any",
        "match_found": true/false,
        "matched_resource_id": "uuid of the resource if matched",
        "category": "Food/Medicine/Shelter/Blood/Rescue",
        "urgency": 1-10
      }
    `;

    const data = {
      model: OLLAMA_CLOUD_MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }],
      stream: false
    };

    const response = await axios.post(`${OLLAMA_CLOUD_HOST}/api/chat`, data, {
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const rawContent = response.data.message.content;
    // Clean up potential markdown formatting if AI returns it
    const jsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI Match Error:', error.response ? error.response.data : error.message);
    return { 
      speech: "I am having trouble accessing the central database. Please tell me what you need clearly.",
      match_found: false,
      category: 'Other',
      urgency: 5
    };
  }
};

const generateMedicalTriageResponse = async (userMessage, chatHistory = []) => {
  try {
    const historyContext = chatHistory.map(m => `${m.sender_id === null ? 'AI' : 'User'}: ${m.text}`).join('\n');

    const prompt = `
      You are the Himachal-Sahayata AI Medical Triage Assistant.
      
      CHAT HISTORY:
      ${historyContext}

      USER MESSAGE:
      "${userMessage}"

      TASK:
      1. Analyze the user's medical symptoms based on the message.
      2. If it is a simple help/injury (Urgency 1-6), provide basic first aid guidance but specify you are an AI. Set connect_doctor to false.
      3. If it is severe, life-threatening, urgent (Urgency 7-10), OR the user explicitly requests a doctor, output connect_doctor: true and advise them a doctor is being connected.
      4. Output ONLY a valid JSON object.

      JSON SCHEMA:
      {
        "speech": "concise medical guidance",
        "connect_doctor": true/false,
        "category": "Medical",
        "urgency": 1-10
      }
    `;

    const data = {
      model: OLLAMA_CLOUD_MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }],
      stream: false
    };

    const response = await axios.post(`${OLLAMA_CLOUD_HOST}/api/chat`, data, {
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const rawContent = response.data.message.content;
    const jsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI Medical Error:', error.response ? error.response.data : error.message);
    return { 
      speech: "I am having trouble connecting to medical services. If this is an emergency, seek immediate local help.",
      connect_doctor: false,
      category: 'Medical',
      urgency: 10
    };
  }
};

module.exports = { triageNeedWithAI, checkSemanticRelevance, generateIntelligentMatchResponse, generateMedicalTriageResponse };
