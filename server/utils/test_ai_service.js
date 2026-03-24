require('dotenv').config();
const { triageNeedWithAI, checkSemanticRelevance } = require('../services/aiService');

async function testAI() {
  console.log('🧠 Testing AI Service (Ollama Cloud)...');

  const testNeed = "Meri family ko medicine chahiye Mandi mein. Unki halat bahut kharab hai SOS.";
  console.log(`\nNeed: "${testNeed}"`);

  try {
    const result = await triageNeedWithAI(testNeed);
    console.log('✅ Triage Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Triage Failed:', error.message);
  }

  const need = "Water for 50 people";
  const resource = "Clean Aquafina bottles (200 qty)";
  console.log(`\nSemantic Match Test: Need="${need}", Resource="${resource}"`);
  
  try {
    const isRelevant = await checkSemanticRelevance(need, resource);
    console.log(`✅ Is Relevent? ${isRelevant}`);
  } catch (error) {
    console.error('❌ Semantic Match Failed:', error.message);
  }
}

testAI();
