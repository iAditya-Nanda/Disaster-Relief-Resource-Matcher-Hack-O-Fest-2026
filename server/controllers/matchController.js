const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { checkSemanticRelevance } = require('../services/aiService');

// Helper for multi-factor scoring
const calculateMatchScore = (match, urgency = 5, targetCategory = null) => {
    const distanceKm = match.distance / 1000;
    const distanceScore = Math.max(0, 40 * (1 - distanceKm / 100));
    const quantityScore = Math.min(15, (match.quantity || 1) / 5);
    const urgencyBoost = (urgency / 10) * 25;
    const categoryBonus = (targetCategory && match.category === targetCategory) ? 20 : 0;

    return parseFloat((distanceScore + quantityScore + urgencyBoost + categoryBonus).toFixed(1));
};

// Find resources near generic coordinates
const findMatches = async (req, res) => {
    try {
        const { lat, lng, radius = 50000, urgency = 5, category = null, useAI = false, situation = "" } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Please provide lat and lng coordinates' });
        }

        const { data, error } = await supabase.rpc('get_nearby_resources', {
            user_lat: parseFloat(lat),
            user_lng: parseFloat(lng),
            radius_meters: parseFloat(radius)
        });

        if (error) throw error;

        // Apply scoring
        let scoredMatches = data.map(match => ({
            ...match,
            match_score: calculateMatchScore(match, parseInt(urgency), category)
        })).sort((a, b) => b.match_score - a.match_score);

        // Advanced AI Filtering (Phase 4.2)
        if (useAI && situation) {
            const aiValidations = await Promise.all(
                scoredMatches.map(async (match) => {
                    const isRelevant = await checkSemanticRelevance(situation, match.title + ' ' + match.category);
                    return isRelevant ? match : null;
                })
            );
            scoredMatches = aiValidations.filter(m => m !== null);
        }

        res.json(scoredMatches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Find resources near a specific Need ID
const findMatchesForNeed = async (req, res) => {
    try {
        const { id } = req.params;
        const { radius = 50000, useAI = false } = req.query;

        const { data: need, error: needError } = await supabase
            .from('needs')
            .select('location, urgency, category, title, description')
            .eq('id', id)
            .single();

        if (needError || !need || !need.location) {
            return res.status(404).json({ error: 'Need not found or has no active geodata.' });
        }

        let lat, lng;
        
        // Handle different possible location formats from Supabase PostGIS
        if (typeof need.location === 'string') {
            const match = need.location.match(/\(([^)]+)\)/);
            if (match) {
                const coords = match[1].split(' ');
                [lng, lat] = coords;
            }
        } else if (need.location.coordinates) {
            [lng, lat] = need.location.coordinates;
        }

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Invalid location format in target need.' });
        }

        const { data, error } = await supabase.rpc('get_nearby_resources', {
            user_lat: parseFloat(lat),
            user_lng: parseFloat(lng),
            radius_meters: parseFloat(radius)
        });

        if (error) throw error;

        let scoredMatches = data.map(match => ({
            ...match,
            match_score: calculateMatchScore(match, need.urgency || 5, need.category)
        })).sort((a, b) => b.match_score - a.match_score);

        // AI Verification for Need
        if (useAI) {
            const situation = `${need.title} ${need.description}`;
            const aiValidations = await Promise.all(
                scoredMatches.map(async (match) => {
                    const isRelevant = await checkSemanticRelevance(situation, match.title);
                    return isRelevant ? match : null;
                })
            );
            scoredMatches = aiValidations.filter(m => m !== null);
        }

        res.json(scoredMatches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { findMatches, findMatchesForNeed };
