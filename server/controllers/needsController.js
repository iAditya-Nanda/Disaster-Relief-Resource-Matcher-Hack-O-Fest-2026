const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { triageNeedWithAI } = require('../services/aiService');

// Helper for urgency extraction
const extractUrgency = (title, description, baseUrgency = 1) => {
  const criticalKeywords = ['emergency', 'urgent', 'critical', 'severe', 'immediate', 'life-saving', 'sos'];
  const text = `${title} ${description}`.toLowerCase();
  
  if (criticalKeywords.some(keyword => text.includes(keyword))) {
    return 10; // Forced maximum urgency
  }
  return baseUrgency;
};

// Post a new help request (Needy logic)
const createNeed = async (req, res) => {
  try {
    const { title, description, urgency, lat, lng } = req.body;

    // if (!title || !lat || !lng) {
    //   return res.status(400).json({ error: 'Missing required fields (title, lat, lng)' });
    // }

    const baseUrgency = extractUrgency(title, description, urgency || 1);
    
    // Phase 4.1: Intelligent AI Triage (using Ollama Cloud)
    let aiCategory = 'Other';
    let aiUrgency = baseUrgency;
    
    try {
        const triage = await triageNeedWithAI(`${title} ${description}`);
        aiCategory = triage.category;
        aiUrgency = Math.max(baseUrgency, triage.urgency); // Take the maximum of base and AI
    } catch (e) {
        console.warn('AI Triage failed, using keyword fallback');
    }

    const { data, error } = await supabase
      .from('needs')
      .insert([
        {
          requester_id: req.user.id,
          title,
          description,
          urgency: aiUrgency,
          category: aiCategory,
          location: `POINT(${lng} ${lat})`,
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get personal request history
const getMyNeeds = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('needs')
      .select('*')
      .eq('requester_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update help request status (Requester/NGO/Admin)
const updateNeedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resource_id } = req.body;

    const { data: need, error: fetchError } = await supabase
      .from('needs')
      .select('requester_id')
      .eq('id', id)
      .single();

    if (fetchError || !need) return res.status(404).json({ error: 'Need not found' });

    // For POC, any authenticated user can update status (we already have RLS disabled)
    // In production, we would re-enable strict role-based checks
    const canUpdate = !!req.user;

    if (!canUpdate) {
      return res.status(403).json({ error: 'Unauthorized to update this request' });
    }

    // Logic for inventory deduction
    const isUuid = (str) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
    
    if (status === 'in_progress' && resource_id && isUuid(resource_id)) {
       const { data: resData, error: resErr } = await supabase
         .from('resources')
         .select('quantity')
         .eq('id', resource_id)
         .single();
       
       if (!resErr && resData && resData.quantity > 0) {
          await supabase.from('resources')
            .update({ quantity: resData.quantity - 1 })
            .eq('id', resource_id);
       }
    }

    const updatePayload = { status };
    // Only use updated_at if it's confirmed or just let DB default if it exists
    // Using a safer approach for POC
    
    const { data, error } = await supabase
      .from('needs')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Update failed, record not found' });
    
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createNeed, getMyNeeds, updateNeedStatus };
