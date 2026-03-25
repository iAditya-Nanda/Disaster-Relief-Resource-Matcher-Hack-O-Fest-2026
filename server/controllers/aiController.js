const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { triageNeedWithAI, generateIntelligentMatchResponse, generateMedicalTriageResponse } = require('../services/aiService');

const getAIAnalysis = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Situation description is required' });
    }

    const analysis = await triageNeedWithAI(description);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const matchChat = async (req, res) => {
  try {
    const { message, need_id, lat, lng } = req.body;
    const userId = req.user.id;

    // 1. Fetch all active NGO resources
    const { data: resources, error: resError } = await supabase
      .from('resources')
      .select('*, profiles(full_name)')
      .eq('status', 'available');

    if (resError) throw resError;

    // 2. Fetch recent chat history if need_id exists
    let chatHistory = [];
    if (need_id) {
      const { data: history, error: histError } = await supabase
        .from('need_messages')
        .select('*')
        .eq('need_id', need_id)
        .order('created_at', { ascending: true });
      
      if (!histError) chatHistory = history;
    }

    // 3. Get AI match response
    const aiResult = await generateIntelligentMatchResponse(message, resources, chatHistory);

    // 4. Persistence
    let finalNeedId = need_id;
    
    // If no need_id, we create one as an "opened" ticket
    if (!finalNeedId) {
      const { data: newNeed, error: needError } = await supabase
        .from('needs')
        .insert([{
          requester_id: userId,
          title: `[OPEN] ${aiResult.category || 'General'} Aid.`,
          description: message,
          summary: aiResult.summary || message,
          status: 'opened',
          urgency: aiResult.urgency || 5,
          category: aiResult.category || 'Other',
          location: lat && lng ? `POINT(${lng} ${lat})` : null
        }])
        .select()
        .single();
      
      if (needError) throw needError;
      finalNeedId = newNeed.id;
    } else {
      // Update existing need: summarize total state
      await supabase
        .from('needs')
        .update({ 
          summary: aiResult.summary,
          category: aiResult.category, 
          urgency: aiResult.urgency,
          status: aiResult.match_found ? 'in_progress' : 'opened'
        })
        .eq('id', finalNeedId);
    }

    // Save User message
    await supabase.from('need_messages').insert([{
      need_id: finalNeedId,
      sender_id: userId,
      text: message,
      is_ai: false
    }]);

    // Save AI message
    const { data: aiMessage, error: aiError } = await supabase.from('need_messages').insert([{
      need_id: finalNeedId,
      sender_id: null,
      text: aiResult.speech,
      is_ai: true
    }]).select().single();

    res.json({
        need_id: finalNeedId,
        ai_response: aiResult.speech,
        match_found: aiResult.match_found,
        category: aiResult.category,
        urgency: aiResult.urgency,
        message: aiMessage
    });

  } catch (error) {
    console.error('MatchChat Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const medicalChat = async (req, res) => {
  try {
    const { message, need_id, lat, lng } = req.body;
    const userId = req.user.id;

    // Fetch recent chat history
    let chatHistory = [];
    if (need_id) {
      const { data: history, error: histError } = await supabase
        .from('need_messages')
        .select('*')
        .eq('need_id', need_id)
        .order('created_at', { ascending: true });
      
      if (!histError) chatHistory = history;
    }

    // Get Medical AI response
    const aiResult = await generateMedicalTriageResponse(message, chatHistory);

    // Persistence
    let finalNeedId = need_id;
    
    if (!finalNeedId) {
      const { data: newNeed, error: needError } = await supabase
        .from('needs')
        .insert([{
          requester_id: userId,
          title: `[MEDICAL] Triage Hub.`,
          description: message,
          summary: aiResult.summary || message,
          status: aiResult.connect_doctor ? 'pending' : 'opened', // 'pending' means waiting for doctor
          urgency: aiResult.urgency || 8,
          category: 'Medical',
          location: lat && lng ? `POINT(${lng} ${lat})` : null
        }])
        .select()
        .single();
      
      if (needError) throw needError;
      finalNeedId = newNeed.id;
    } else {
      await supabase
        .from('needs')
        .update({ 
          summary: aiResult.summary,
          urgency: aiResult.urgency,
          status: aiResult.connect_doctor ? 'pending' : 'opened'
        })
        .eq('id', finalNeedId);
    }

    await supabase.from('need_messages').insert([{
      need_id: finalNeedId,
      sender_id: userId,
      text: message,
      is_ai: false
    }]);

    const { data: aiMessage, error: aiError } = await supabase.from('need_messages').insert([{
      need_id: finalNeedId,
      sender_id: null,
      text: aiResult.speech,
      is_ai: true
    }]).select().single();

    res.json({
        need_id: finalNeedId,
        ai_response: aiResult.speech,
        connect_doctor: aiResult.connect_doctor,
        category: aiResult.category,
        urgency: aiResult.urgency,
        message: aiMessage
    });

  } catch (error) {
    console.error('Medical Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAIAnalysis, matchChat, medicalChat };
