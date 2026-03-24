const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const crypto = require('crypto');

// 5.1: Generate a unique collection token (for QR generation on frontend)
const generateCollectionToken = async (req, res) => {
  try {
    const { resourceId } = req.body;
    
    // Create a secure 16-char token
    const token = crypto.randomBytes(8).toString('hex');
    
    // Store it in Supabase (we'll reuse the resources table or a match table)
    // For simplicity in the demo, we update a 'collection_token' field
    const { data, error } = await supabase
      .from('resources')
      .update({ collection_token: token })
      .eq('id', resourceId)
      .eq('provider_id', req.user.id) // Security: Must own it
      .select();

    if (error || data.length === 0) return res.status(403).json({ error: 'Permission denied or resource not found' });
    
    res.json({ token, qr_data: `COLLECT_${resourceId}_${token}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5.1: Verify a collection (The Scan-to-Confirm logic)
const verifyCollection = async (req, res) => {
  try {
    const { resourceId, token } = req.body;

    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('collection_token, status')
      .eq('id', resourceId)
      .single();

    if (fetchError || !resource) return res.status(404).json({ error: 'Resource not found' });
    if (resource.collection_token !== token) return res.status(400).json({ error: 'Invalid verification token' });

    // Mark as Delivered
    const { data, error } = await supabase
      .from('resources')
      .update({ status: 'delivered', collection_token: null })
      .eq('id', resourceId)
      .select();

    if (error) throw error;
    res.json({ message: 'Resource successfully verified and delivered!', resource: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateCollectionToken, verifyCollection };
