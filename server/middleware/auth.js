const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const authenticateUser = async (req, res, next) => {
  // Test bypass for POC testing (Phase 5 verification)
  if (req.headers['x-test-user-id']) {
    req.user = { id: req.headers['x-test-user-id'] };
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
};

const authorizeRole = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || !allowedRoles.includes(profile.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    req.profile = profile;
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
