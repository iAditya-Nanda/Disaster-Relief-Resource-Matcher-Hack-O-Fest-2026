const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// 5.2: Emergency Blood Matching
const findBloodDonors = async (req, res) => {
  try {
    const { bloodType, lat, lng, radius = 50000 } = req.query;

    if (!bloodType || !lat || !lng) {
      return res.status(400).json({ error: 'Blood type and coordinates required' });
    }

    // We'll reuse our PostGIS expertise for the current_location point in blood_inventory
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*, profiles(full_name, phone)')
      .eq('blood_type', bloodType)
      .eq('is_available', true);

    if (error) throw error;

    // Optional: Filter by proximity on the node side if RPC is not generic
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { findBloodDonors };
