const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { authenticateUser } = require('../middleware/auth');

// Add a volunteer
router.post('/add', authenticateUser, async (req, res) => {
    try {
        const { name, skills, status, lat, lng } = req.body;
        
        const { data, error } = await supabase
            .from('volunteers')
            .insert([{
                ngo_id: req.user.id,
                name,
                skills,
                status: status || 'available',
                location: lat && lng ? `POINT(${lng} ${lat})` : null
            }])
            .select();

        if (error) throw error;
        
        res.status(201).json({ message: 'Volunteer added', data });
    } catch (err) {
        console.error('Add volunteer error:', err);
        res.status(500).json({ error: 'Failed to add volunteer' });
    }
});

// Get all volunteers for current NGO
router.get('/my-volunteers', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('volunteers')
            .select('*')
            .eq('ngo_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        res.status(200).json({ data });
    } catch (err) {
        console.error('Fetch volunteers error:', err);
        res.status(500).json({ error: 'Failed to fetch volunteers' });
    }
});

module.exports = router;
