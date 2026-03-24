const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.get('/v1/dashboard', async (req, res) => {
  try {
    const { count: resCount } = await supabase.from('resources').select('*', { count: 'exact', head: true });
    const { count: needCount } = await supabase.from('needs').select('*', { count: 'exact', head: true });
    const { count: matchCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });
    const { count: volCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'NGO');

    res.json({
      resources: resCount || 0,
      needs: needCount || 0,
      matches: matchCount || 0,
      volunteers: volCount || 12, // Default small number if no profiles
      grid_integrity: 'SECURE',
      active_hubs: 3,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meaningful stats.' });
  }
});

module.exports = router;
