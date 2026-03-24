const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Create a new resource (NGO logic)
const createResource = async (req, res) => {
  try {
    const { title, category, quantity, unit, lat, lng } = req.body;

    if (!title || !category || !lat || !lng) {
      return res.status(400).json({ error: 'Missing required fields (title, category, lat, lng)' });
    }

    const { data, error } = await supabase
      .from('resources')
      .insert([
        {
          provider_id: req.user.id,
          title,
          category,
          quantity,
          unit,
          location: `POINT(${lng} ${lat})`, // PostGIS Point
          status: 'available'
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all resources near a location (Public logic)
const getNearbyResources = async (req, res) => {
  try {
    const { lat, lng, radius = 50000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Coordinates (lat, lng) are required' });
    }

    const { data, error } = await supabase.rpc('get_nearby_resources', {
      user_lat: parseFloat(lat),
      user_lng: parseFloat(lng),
      radius_meters: parseFloat(radius)
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update resource status (NGO/Admin only)
const updateResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Verify ownership or Admin role
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('provider_id')
      .eq('id', id)
      .single();

    if (fetchError || !resource) return res.status(404).json({ error: 'Resource not found' });
    
    if (resource.provider_id !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden: You do not own this resource' });
    }

    // 2. Perform Update
    const { data, error } = await supabase
      .from('resources')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createResource, getNearbyResources, updateResourceStatus };
