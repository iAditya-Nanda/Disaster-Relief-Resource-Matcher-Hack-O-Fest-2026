require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function seed() {
  console.log('🌱 Seeding demo data...');

  // 1. Create NGO User
  const ngoEmail = `ngo.official.${Math.floor(Math.random() * 1000)}@gmail.com`;
  const { data: ngoAuth, error: ngoError } = await supabase.auth.signUp({
    email: ngoEmail,
    password: 'password123',
    options: {
      data: {
        full_name: 'Himachal Relief NGO',
        role: 'NGO'
      }
    }
  });

  if (ngoError) {
    console.error('❌ NGO Auth Error:', ngoError.message);
  } else {
    console.log('✅ NGO User Signed Up:', ngoEmail);
  }

  // 2. Create Needy User
  const needyEmail = `needy.aditya.${Math.floor(Math.random() * 1000)}@gmail.com`;
  const { data: needyAuth, error: needyError } = await supabase.auth.signUp({
    email: needyEmail,
    password: 'password123',
    options: {
      data: {
        full_name: 'Aditya (Needy)',
        role: 'Needy'
      }
    }
  });

  if (needyError) {
    console.error('❌ Needy Auth Error:', needyError.message);
  } else {
    console.log('✅ Needy User Created:', needyEmail);
  }

  const ngoId = ngoAuth?.user?.id;
  const needyId = needyAuth?.user?.id;

  if (!ngoId || !needyId) {
    console.error('❌ Could not get user IDs. Make sure email confirmation is disabled in Supabase or use a different method.');
    return;
  }

  // 3. Add NGO Resources
  console.log('📦 Adding Resources...');
  const { error: resError } = await supabase.from('resources').insert([
    {
      provider_id: ngoId,
      title: 'Warm Blankets',
      category: 'Shelter',
      quantity: 100,
      unit: 'pieces',
      location: 'POINT(77.1734 31.1048)' // Shimla
    },
    {
      provider_id: ngoId,
      title: 'First Aid Kits',
      category: 'Medicine',
      quantity: 50,
      unit: 'kits',
      location: 'POINT(76.9182 31.5892)' // Mandi
    }
  ]);

  if (resError) console.error('❌ Resource Insert Error:', resError.message);
  else console.log('✅ Resources added.');

  // 4. Add Needy Needs
  console.log('🆘 Adding Needs...');
  const { error: needError } = await supabase.from('needs').insert([
    {
      requester_id: needyId,
      title: 'Emergency Help',
      description: 'Need immediate medical help near Mandi, family is shivering.',
      urgency: 10,
      location: 'POINT(76.9182 31.5892)'
    }
  ]);

  if (needError) console.error('❌ Needs Insert Error:', needError.message);
  else console.log('✅ Needs added.');

  console.log('🚀 Seeding complete!');
}

seed();
