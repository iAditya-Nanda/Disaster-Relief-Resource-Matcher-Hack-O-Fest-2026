require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://connect-api.adimita-tech.workers.dev';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const API_BASE = 'http://localhost:5000/api';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runFullTest() {
  console.log('🧪 Starting Detailed Backend Test Protocol...\n');

  // 1. Health Check
  try {
    const health = await axios.get(`${API_BASE}/health`);
    console.log(`✅ Phase 1: Health Check -> Status: ${health.status}, Msg: ${health.data.status}`);
    console.log(`📡 Service Name: ${health.data.service}`);
  } catch (error) {
    console.error('❌ Phase 1: Health Check Failed:', error.message);
  }

  // 2. Auth Status Note
  console.log('\n🔐 Phase 2: Authentication (Using Bypass for POC Testing)');
  console.log('💡 Note: Standard Supabase Auth is rate-limited in free tier, using X-Test-User-ID bypass.');

  // 3. NGO Resource Posting
  console.log('\n📦 Phase 3: NGO Resource Posting (POST /api/resources/add)');
  const ngoId = 'bb89335a-ddbb-4030-92e7-6681240c20a8';
  try {
    const res = await axios.post(`${API_BASE}/resources/add`, {
      title: 'Emergency Medical Kits',
      category: 'Medicine',
      quantity: 50,
      unit: 'kits',
      lat: 31.5892,
      lng: 76.9182 // Mandi location
    }, {
      headers: { 'X-Test-User-ID': ngoId }
    });
    console.log('✅ Resource Response [201 Created]:');
    console.log('   - ID:', res.data.id);
    console.log('   - Title:', res.data.title);
    console.log('   - Category:', res.data.category);
  } catch (error) {
    console.error('❌ Resource Post Failed:', error.response ? error.response.data : error.message);
  }

  // 4. Needy Request (AI Triage Test)
  console.log('\n🧠 Phase 4: Needy Request & AI Triage (POST /api/needs/add)');
  const needyId = 'd186ad60-7978-4db6-8188-fa439d017bff';
  try {
    const res = await axios.post(`${API_BASE}/needs/add`, {
      title: 'URGENT Landslide SOS',
      description: 'Family trapped in car near Mandi. Life at risk. Need rescue and oxygen.',
      lat: 31.5892,
      lng: 76.9182
    }, {
      headers: { 'X-Test-User-ID': needyId }
    });
    console.log('✅ Need Response [201 Created]:');
    console.log('   - ID:', res.data.id);
    console.log('   - AI Category:', res.data.category);
    console.log('   - AI Urgency Score:', res.data.urgency); // Should be 10 due to 'SOS'
  } catch (error) {
    console.error('❌ Need Post Failed:', error.response ? error.response.data : error.message);
  }

  // 5. Intelligent Matchmaking
  console.log('\n📡 Phase 5: Intelligent Matchmaking (GET /api/matches/near)');
  try {
    const res = await axios.get(`${API_BASE}/matches/near`, {
      params: {
        lat: 31.5892,
        lng: 76.9182,
        radius: 10000, // 10km
        useAI: true,
        situation: 'Car trapped in landslide'
      },
      headers: { 'X-Test-User-ID': ngoId }
    });
    console.log(`✅ Matches Found: ${res.data.length}`);
    res.data.forEach((m, i) => {
        console.log(`   #${i+1}: ${m.title} [Distance: ${(m.distance/1000).toFixed(2)}km, Score: ${m.match_score}]`);
    });
  } catch (error) {
    console.error('❌ Matchmaking Failed:', error.response ? error.response.data : error.message);
  }

  console.log('\n✨ Backend full check complete for Hack-O-Fest 2026.');
}

runFullTest();
