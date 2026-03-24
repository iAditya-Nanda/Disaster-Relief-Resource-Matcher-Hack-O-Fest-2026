require('dotenv').config();
const axios = require('axios');

async function testOllamaRaw() {
  const host = process.env.OLLAMA_CLOUD_HOST || 'https://api.ollama.com';
  const key = process.env.OLLAMA_API_KEY;
  const model = process.env.OLLAMA_CLOUD_MODEL || 'gpt-oss:120b';

  console.log(`🚀 Testing Ollama Cloud Raw... Host: ${host}, Model: ${model}`);

  const endpoints = [
    `${host}/v1/chat/completions`,
    `${host}/api/chat`,
    `${host}/api/generate`
  ];

  for (const url of endpoints) {
    console.log(`\n--- Trying: ${url} ---`);
    try {
      const response = await axios.post(url, {
        model,
        messages: [{ role: 'user', content: 'Say hello' }],
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Success!', response.data.choices ? response.data.choices[0].message.content : response.data.message.content);
      break; 
    } catch (error) {
      console.error('❌ Failed:', error.response ? error.response.data : error.message);
    }
  }
}

testOllamaRaw();
